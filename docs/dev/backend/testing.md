---
prev:
  text: 'Backend › Configuração'
  link: '/dev/backend/config'

next:
  text: 'Backend › Como adicionar um recurso'
  link: '/dev/backend/new-resource'
---

# Testes, lint e tipos

O backend tem uma suíte grande de testes com **pytest**, rodando contra um **PostgreSQL de verdade**, com as migrações reais aplicadas. Esta página explica a organização e o funcionamento. As convenções detalhadas das factories e as métricas de cobertura estão no `docs/TESTS.md` do backend.

## Estrutura de `tests/`

```bash
tests/
├── conftest.py              # migrações, sessão isolada por teste, usuários, clients e fixtures de domínio
├── test_initial.py          # testa o initial_data.py
├── api/                     # testes HTTP completos (TestClient), um arquivo por módulo de rota
│   ├── public/
│   ├── authenticated/
│   ├── restricted/
│   └── admin/
├── integration/             # com banco, sem HTTP
│   ├── repositories/        #   um arquivo por repositório
│   ├── services/            #   serviços, com security/ espelhando server/services/security/
│   └── deps/                #   dependências, com repository_adapters/
├── unit/                    # sem banco
│   ├── models/              #   lógica dos models, com requests/ e responses/
│   ├── services/            #   com security/
│   ├── deps/, middlewares/, enums/, cache/, utils/
├── services/                # crawlers do JupiterWeb e do Janus, contra snapshots
├── factories/               # construção de dados de teste
│   ├── base/                #   valores padrão (Faker) de cada entidade, sem sessão
│   ├── model/               #   models SQLModel, com relacionamentos e sessão
│   ├── request/             #   payloads de requisição
│   └── response/            #   (vazio)
├── utils/                   # helpers make_*() reaproveitáveis (com e sem banco) e validadores
├── data/                    # snapshots HTML/JSON do JupiterWeb e do Janus
├── scripts/                 # gerar/promover snapshots, atualizar as métricas do TESTS.md
├── performance/             # testes de desempenho, separados da suíte de correção
└── e2e/                     # (vazio)
```

A pasta de um teste segue duas perguntas: **toca o banco?** (`unit` não toca; `integration` e `api` tocam) e **passa pelo HTTP?** (só `api`). Quando o código em `server/` tem uma subpasta (como `services/security/`), os testes espelham essa subpasta no tier correspondente.

## Banco de testes e isolamento

A suíte usa um banco **exclusivo**, apontado por `TEST_DATABASE_URI`, `TEST_DATABASE_NAME` e `TEST_ALEMBIC_URL` (veja [Configuração](/dev/backend/config#testes)). Nunca aponte essas variáveis para o banco que você usa no dia a dia.

- **Schema:** a fixture `apply_migrations` (`autouse`, `scope="session"`) roda `alembic upgrade head` contra `TEST_ALEMBIC_URL` uma vez por execução. A suíte não usa `SQLModel.metadata.create_all()`: ela testa as migrações de verdade, então uma migração quebrada falha nos testes antes do deploy.
- **Isolamento:** a fixture `session` abre uma conexão, inicia uma transação e cria a `Session` com `join_transaction_mode="create_savepoint"`. Os `session.commit()` do código viram savepoints dentro dessa transação, e no fim do teste tudo recebe `rollback()`. Nenhum dado escrito sobrevive ao teste, sem precisar truncar tabelas.
- **Configuração forçada:** o `conftest.py` liga `CONFIG.testing` (que desliga Redis e rate limit) e fixa um `API_KEY_SECRET` de teste, para que os hashes das chaves não dependam de quem roda a suíte.

## Fixtures principais (`tests/conftest.py`)

| Fixture | O que entrega |
|---|---|
| `session` | A sessão isolada do teste |
| `admin_user` | O admin de `FIRST_SUPERUSER_EMAIL` (criado se não existir) |
| `restricted_user` | Um usuário comum com acesso ao `building` |
| `common_user` | Um usuário comum sem prédio nem grupo |
| `client` | `TestClient` autenticado como `admin_user` |
| `restricted_client`, `common_client` | `TestClient` autenticados como os usuários acima |
| `public_client` | `TestClient` sem autenticação |
| `building`, `group`, `classroom`, `allocated_classroom`, `subject`, `class_`, `meeting`, `exam`, `event`, `role` | Dados de domínio prontos, criados pelas factories |

Os clients sobrescrevem `get_db` (para usar a sessão isolada), `authenticate` e `google_token_authenticate` via `app.dependency_overrides`, e limpam os overrides no fim. Use o client do tier da rota que você está testando.

## Factories

Cada entidade com factory tem quatro peças:

1. **dict base** (`server/models/dicts/base/<recurso>_base_dict.py`): os campos "de negócio", sem id, FKs nem relacionamentos;
2. **dict do model** (`server/models/dicts/database/<recurso>_database_dicts.py`): acrescenta FKs, timestamps e relacionamentos;
3. **factory base** (`tests/factories/base/<recurso>_base_factory.py`): preenche o dict base com o Faker (`pt_BR`, uma instância compartilhada);
4. **factory do model** (`tests/factories/model/<recurso>_model_factory.py`): acrescenta FKs e relacionamentos e sabe persistir.

A factory do model oferece `build(**overrides)` (só instancia, sem tocar o banco), `create(...)` (instancia e faz `add`) e `create_and_refresh(...)` (também faz `commit` e `refresh`):

```python
classroom = ClassroomModelFactory(creator=admin_user, building=building, session=session).create_and_refresh(
    capacity=80,
)
```

Os overrides só substituem chaves que já existem nos valores padrão: um override de um campo que não está no dict é ignorado em silêncio. Os detalhes (quando `build()` ainda toca o banco, FKs que não sincronizam sem flush, helpers com e sem banco em `tests/utils/`) estão no `docs/TESTS.md` do backend, seção 5.

## Crawlers e snapshots

Os testes de `tests/services/` reproduzem os crawlers contra **snapshots** de páginas reais em `tests/data/`, sem acessar a rede numa execução normal:

- o snapshot do **JupiterWeb** é separado por semestre. Na virada de semestre, o teste baixa um candidato uma vez, salva em `pending/` e falha pedindo revisão. Depois de revisar, promova com `tests/scripts/promote_jupiter_snapshot.py`;
- o do **Janus** não depende do semestre e só é atualizado manualmente, com `tests/scripts/generate_janus_snapshot.py`.

## Rodando

```bash
poetry run pytest                                         # suíte completa, com cobertura
poetry run pytest tests/api/public/test_x.py              # um arquivo
poetry run pytest tests/api/public/test_x.py::test_y      # um teste
poetry run pytest -k classroom                            # por nome
```

O `addopts` do `pyproject.toml` já liga a cobertura (`--cov=server`, com relatório no terminal e em `htmlcov/index.html`, e cobertura de branches). Para atualizar a tabela de métricas do `TESTS.md`, rode `poetry run python tests/scripts/update_test_metrics.py`.

Com o ambiente Docker:

```bash
docker exec uspolis-admin-backend-1 sh -c 'cd /app/backend && poetry run pytest'
```

> [!NOTE]
> O CI do backend ainda não roda os testes, o mypy nem o ruff: ele só faz o deploy. Rode os três localmente antes de abrir um PR.

## Lint e checagem de tipos

```bash
poetry run mypy server
poetry run ruff check server
poetry run ruff format server
```

O `mypy` roda em modo estrito (`disallow_untyped_defs`, `disallow_incomplete_defs`, `disallow_any_unimported`, `warn_return_any`, `strict_equality`, `no_implicit_optional`, entre outras flags em `[tool.mypy]` no `pyproject.toml`): funções sem type hints, ou com `Any` implícito, não passam. O `ruff` usa `line-length = 88` e a regra `UP` (pyupgrade).
