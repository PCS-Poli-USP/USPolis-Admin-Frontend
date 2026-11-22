---
prev:
  text: 'Tabelas, Modelos e Relacionamentos'
  link: '/dev/database/models'

next:
  text: 'Backup'
  link: '/dev/database/backup'

---


# Migrações

Usamos o **Alembic** para versionar o schema do banco. Toda mudança na estrutura das tabelas (nova coluna, nova tabela, novo índice, etc.) precisa vir acompanhada de uma migração — não alteramos o schema manualmente em produção.

## Onde tudo fica

- `alembic.ini` (raiz do repositório do backend) — configuração principal. `script_location = migrations` aponta pra pasta de migrações; a `sqlalchemy.url` que está escrita nesse arquivo é só um placeholder e **nunca é usada de fato**, porque `migrations/env.py` sempre sobrescreve essa URL na hora de rodar.
- `migrations/env.py` — o "cérebro" da configuração. A função `get_url()` decide qual banco usar: primeiro olha se existe uma variável de ambiente `ALEMBIC_URL` já setada no processo (é assim que os testes apontam para o banco de teste, veja [Backend › Testes](/dev/backend/testing)), e se não existir cai para `CONFIG.alembic_url` (a variável `ALEMBIC_URL` do seu `.env.dev`/`.env.prod`/`.env.stage`). Também importa `server.db` só para garantir que **todos** os models estejam registrados em `SQLModel.metadata` antes de qualquer autogenerate — sem esse import, o Alembic não enxergaria tabelas que não tenham sido importadas ainda.
- `migrations/versions/` — uma migração por arquivo, hoje já são mais de 80. Cada uma tem um `revision` (hash) e um `down_revision` (o hash da migração anterior), formando uma lista encadeada — é assim que o Alembic sabe a ordem de aplicação.

## Comandos do dia a dia

Depois de mudar um model em `server/models/database/` (e garantir que ele está importado, direta ou indiretamente, em `server/db.py` — veja [Banco de Dados › Onde os models vivem](/dev/database/#onde-os-models-vivem)), gere a migração automaticamente:

```bash
poetry run alembic revision --autogenerate -m "mensagem descrevendo a mudança"
```

**Sempre revise o arquivo gerado antes de commitar.** O autogenerate do Alembic é bom para detectar colunas/tabelas/índices novos ou removidos, mas não é perfeito — ele não percebe, por exemplo, renomeação de coluna (vê como um `drop` + um `add`) nem sabe preencher dados em uma coluna nova. Quando é preciso popular/transformar dados existentes (não só mudar a estrutura), é comum complementar o autogenerate com um `op.execute(...)` de SQL cru dentro da própria migração, por exemplo:

```python
def upgrade() -> None:
    op.add_column("solicitation", sa.Column("denial_justification", sa.String(), nullable=True))
    op.execute("""
        UPDATE solicitation SET denial_justification = 'Justificativa dada por email'
        FROM reservation WHERE ...
    """)
```

Aplicar as migrações pendentes (isso é o que efetivamente cria/altera as tabelas no banco):

```bash
poetry run alembic upgrade head
```

Outros comandos úteis:

```bash
poetry run alembic current       # qual migração o banco atual está
poetry run alembic history        # lista todas as migrações em ordem
poetry run alembic downgrade -1    # desfaz a última migração aplicada
poetry run alembic downgrade base   # desfaz TODAS as migrações (cuidado)
```

## O que o autogenerate não enxerga

Além de renomeações e dados, o autogenerate ignora tudo o que não é tabela, coluna, índice ou constraint declarado nos models: **views, extensões, configurações de busca textual, funções e triggers**. Esses objetos precisam ser criados com `op.execute(...)` numa migração escrita à mão, com o `downgrade()` correspondente. O exemplo do projeto é a migração da busca geral (`5c8e1f2a9b47_create_search_document_view.py`), que cria as extensões `unaccent` e `pg_trgm`, a configuração `pt_unaccent` e a view materializada `search_document` (veja [Banco de Dados › Busca](/dev/database/#busca-a-view-search-document)).

Se você muda uma tabela que a view `search_document` lê (disciplinas, turmas, salas, prédios, reservas), confira se a view continua válida: pode ser preciso recriá-la na mesma migração.

## Transações

O `migrations/env.py` roda com `transaction_per_migration=True`: cada migração roda na própria transação. Se uma migração falha no meio de um `upgrade head`, as anteriores continuam aplicadas e o banco fica na última que deu certo (`alembic current` mostra qual).

## Bancos novos e o `pre_start.py`

Num banco **vazio**, `alembic upgrade head` monta o schema inteiro a partir da primeira migração. É o que a suíte de testes faz a cada execução e o que a [configuração manual](/dev/enviroment/#banco-de-dados) recomenda.

O ambiente Docker passa antes pelo `server/scripts/pre_start.py`, chamado pelo `docker/entrypoint.sh`. Ele espera o banco aceitar conexões e, **se o banco ainda não tem a tabela `alembic_version`**, cria as tabelas direto dos models (`SQLModel.metadata.create_all()`) e marca todas as migrações como aplicadas (`alembic stamp head`), sem rodá-las. Num banco que já tem `alembic_version`, ele não faz nada e deixa o `alembic upgrade head` seguinte trabalhar.

> [!WARNING]
> O caminho do `create_all()` só cria o que está nos models. O que as migrações criam à mão, como a view `search_document`, as extensões e a configuração `pt_unaccent`, **não é criado**, e o `stamp head` impede que as migrações rodem depois. Um banco novo montado pelo Docker fica sem a busca geral. Testamos: o histórico de migrações sobe sem erro num banco vazio, então o atalho do `create_all()` não é necessário, apesar do comentário no `pre_start.py` dizer o contrário. Até o script ser corrigido, a busca só funciona em bancos montados pelas migrações.

## Async vs. sync

`migrations/env.py` suporta rodar tanto contra uma URL `postgresql+asyncpg://` (usando `async_engine_from_config` + `asyncio.run`) quanto contra uma URL síncrona comum (`engine_from_config`) — a decisão é automática, baseada no prefixo da URL configurada. Na prática, `ALEMBIC_URL` no `.env` sempre usa o driver `asyncpg`, então o caminho assíncrono é o que roda no dia a dia.

## Migrações no banco de testes

A suíte de testes **não** usa `SQLModel.metadata.create_all()` para montar o schema — ela roda as migrações de verdade. A fixture `apply_migrations` em `tests/conftest.py` (que roda uma única vez por sessão de testes) seta a variável de ambiente `ALEMBIC_URL` para o valor de `TEST_ALEMBIC_URL` e chama `alembic upgrade head` programaticamente. Isso garante que a suíte de testes rode contra um schema **idêntico** ao que seria criado em produção pelas mesmas migrações — se uma migração tiver algum problema, os testes pegam isso antes de qualquer deploy.
