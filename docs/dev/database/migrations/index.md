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
- `migrations/env.py` — o "cérebro" da configuração. A função `get_url()` decide qual banco usar: primeiro olha se existe uma variável de ambiente `ALEMBIC_URL` já setada no processo (é assim que os testes apontam para o banco de teste, veja [Backend › Testes](/dev/backend#testes)), e se não existir cai para `CONFIG.alembic_url` (a variável `ALEMBIC_URL` do seu `.env.dev`/`.env.prod`/`.env.stage`). Também importa `server.db` só para garantir que **todos** os models estejam registrados em `SQLModel.metadata` antes de qualquer autogenerate — sem esse import, o Alembic não enxergaria tabelas que não tenham sido importadas ainda.
- `migrations/versions/` — uma migração por arquivo, hoje já são mais de 70. Cada uma tem um `revision` (hash) e um `down_revision` (o hash da migração anterior), formando uma lista encadeada — é assim que o Alembic sabe a ordem de aplicação.

## Comandos do dia a dia

Depois de mudar um model em `server/models/database/` (e garantir que ele está importado, direta ou indiretamente, em `server/db.py` — veja [Banco de Dados › Onde os models vivem](/dev/database#onde-os-models-vivem)), gere a migração automaticamente:

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

## Async vs. sync

`migrations/env.py` suporta rodar tanto contra uma URL `postgresql+asyncpg://` (usando `async_engine_from_config` + `asyncio.run`) quanto contra uma URL síncrona comum (`engine_from_config`) — a decisão é automática, baseada no prefixo da URL configurada. Na prática, `ALEMBIC_URL` no `.env` sempre usa o driver `asyncpg`, então o caminho assíncrono é o que roda no dia a dia.

## Migrações no banco de testes

A suíte de testes **não** usa `SQLModel.metadata.create_all()` para montar o schema — ela roda as migrações de verdade. A fixture `apply_migrations` em `tests/conftest.py` (que roda uma única vez por sessão de testes) seta a variável de ambiente `ALEMBIC_URL` para o valor de `TEST_ALEMBIC_URL` e chama `alembic upgrade head` programaticamente. Isso garante que a suíte de testes rode contra um schema **idêntico** ao que seria criado em produção pelas mesmas migrações — se uma migração tiver algum problema, os testes pegam isso antes de qualquer deploy.
