---
prev:
  text: 'Frontend'
  link: '/dev/frontend'

next:
  text: 'Tabelas, Modelos e Relacionamentos'
  link: '/dev/database/models'
---

# Banco de Dados

Usamos **PostgreSQL** como banco relacional, acessado a partir do backend via **SQLModel** (que por baixo dos panos usa **SQLAlchemy**) — veja [Tecnologias Utilizadas](/dev/stack#backend). Não há nenhuma versão em nuvem/serverless nem containerizada oficial: tanto em desenvolvimento quanto em produção é um PostgreSQL "de verdade" rodando num servidor (veja [Configurando seu Ambiente › Banco de dados](/dev/enviroment#banco-de-dados) para subir um localmente).

Esta seção cobre:

- [Tabelas, Modelos e Relacionamentos](/dev/database/models) — todas as ~50 tabelas do sistema, agrupadas por domínio
- [Migrações](/dev/database/migrations) — como o schema evolui ao longo do tempo, via Alembic
- [Backup](/dev/database/backup) — como os dados são protegidos contra perda

## Onde os models vivem

Cada tabela é um arquivo em `server/models/database/` no repositório do backend, com uma classe SQLModel (`table=True`). A convenção de nome de arquivo é `<entidade>_db_model.py` para tabelas "normais" e `<entidade_a>_<entidade_b>_link.py` para tabelas de ligação N:N (ex: `group_user_link.py`). Praticamente todos os models herdam de `BaseModel` (`server/models/database/base_db_model.py`), que só define um `id: int` autoincremento como chave primária — as exceções (`CourseOptions`, `UserScheduleEntry`, `UserSession`) têm chave primária própria (composta, ou uma string, no caso da sessão) e herdam direto de `SQLModel`.

> [!IMPORTANT]
> Sempre que um model novo for criado, ele precisa acabar sendo importado (direta ou indiretamente) por `server/db.py` — é essa cadeia de imports que registra a tabela em `SQLModel.metadata`, e é a partir desse metadata que o Alembic detecta o que mudou na hora de gerar uma migração com `--autogenerate` (veja [Migrações](/dev/database/migrations)). Hoje isso funciona porque vários models são importados indiretamente por outros (ex: `user_db_model.py` importa `group_db_model`), então nem todo arquivo em `server/models/database/` precisa estar listado explicitamente em `server/db.py` — mas o mais seguro ao criar um recurso novo é sempre adicionar o import lá também.

## Separação entre model de banco e schema HTTP

Como já mencionado em [Backend](/dev/backend#banco-de-dados), os models do SQLModel (`server/models/database/`) são **exclusivamente** a representação da tabela — eles não são reaproveitados como schema de request/response da API. Isso é intencional: permite, por exemplo, que o model de banco tenha uma coluna sensível ou interna que nunca é serializada de volta para o cliente, sem precisar de `exclude=` espalhado pelo código.

## A tabela `reservation` como "hub" central

Boa parte do domínio de agendamento gira em torno da tabela `reservation`, que funciona como uma tabela "pai" genérica: toda reserva de sala — seja uma prova, um evento institucional ou uma reunião — cria uma linha em `reservation` e, associada a ela (por uma foreign key **única**, ou seja, é uma relação 1:1), uma linha na tabela da especialização correspondente:

| Especialização | Tabela | Campo extra além do vínculo com `reservation` |
|---|---|---|
| Prova | `exam` | `subject_id`, e quais turmas ela vale (`examclasslink`) |
| Evento institucional | `event` | `type`, `link` |
| Reunião | `meeting` | `link` |
| Solicitação pendente de aprovação | `solicitation` | prédio, sala pedida, quem pediu, justificativa de negação |

Isso é o equivalente, em SQL puro, ao padrão de herança "table-per-type": em vez de uma única tabela `reservation` com colunas opcionais para cada tipo (ou uma coluna `type` com um monte de `NULL`), cada especialização vive na sua própria tabela, e o campo comum (data, hora, prédio, sala, quem criou, recorrência) fica centralizado em `reservation` e em `schedule` (que guarda os horários e é o que efetivamente conecta uma reserva à sala e à agenda). Veja mais detalhes em [Tabelas, Modelos e Relacionamentos](/dev/database/models#reservas-e-suas-especializações).

## Sistema de permissões

Existem hoje **duas camadas** de controle de acesso persistidas no banco (veja também o aviso em [Backend › Autenticação](/dev/backend#autenticação)):

1. O vínculo direto usuário↔prédio (`userbuildinglink`) e usuário↔grupo (`groupuserlink`), que é o que a maioria das checagens de permissão em produção usa hoje.
2. Um sistema mais granular baseado em `Role` (papel) — `role`, `userrole`, e as permissões específicas por recurso (`buildingpermission`, `classroompermission`, `coursepermission`), cada uma com uma lista de ações permitidas (ex: `Prédios · Criar`, `Prédios · Reservar`). Esse é o sistema usado pela página [Minha Conta](/profile/) (seção "Papéis e permissões") e documentado em detalhes no `PERMISSIONS.md` do repositório do backend.

Ambos coexistem no banco atualmente.
