---
prev:
  text: 'Backend › Testes, lint e tipos'
  link: '/dev/backend/testing'

next:
  text: 'Frontend › Visão geral'
  link: '/dev/frontend/'
---

# Como adicionar um recurso

Este é o caminho completo para criar um recurso novo no backend. O exemplo usa um recurso fictício, **equipamento** (`equipment`), um item ligado a uma sala e gerenciado por admins. É o mesmo exemplo usado em [Frontend › Como adicionar uma funcionalidade](/dev/frontend/new-feature), que continua a partir do passo 9.

Antes de começar, leia [Estrutura de arquivos](/dev/backend/structure) e [Fluxo de uma requisição](/dev/backend/request-flow): os passos abaixo criam um arquivo em cada camada descrita lá.

## 1. Model

```python
# server/models/database/equipment_db_model.py
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, UniqueConstraint

from server.models.database.base_db_model import BaseModel

if TYPE_CHECKING:
    from server.models.database.classroom_db_model import Classroom


class Equipment(BaseModel, table=True):
    __table_args__ = (UniqueConstraint("name", "classroom_id"),)

    name: str
    classroom_id: int = Field(foreign_key="classroom.id", ondelete="CASCADE")

    classroom: "Classroom" = Relationship(back_populates="equipments")
```

- Herde de `BaseModel` (`base_db_model.py`), que já define o `id`.
- Use `__table_args__` (com um underscore de cada lado de `table`): um erro de digitação aqui é ignorado em silêncio pelo SQLAlchemy, e a constraint nunca chega ao banco.
- Se o relacionamento é bidirecional, adicione o lado inverso no outro model (aqui, `equipments` em `Classroom`).

## 2. Registrar o model e gerar a migração

Adicione o import em `server/db.py`, na lista `from server.models.database import (...)`. É essa lista que registra a tabela em `SQLModel.metadata`, de onde o Alembic tira o que mudou.

```bash
poetry run alembic revision --autogenerate -m "add equipment table"
```

**Revise o arquivo gerado** em `migrations/versions/` antes de commitar: o autogenerate não percebe renomeações (vê um drop + um add), não preenche dados e não enxerga views nem extensões. Depois aplique e teste o downgrade:

```bash
poetry run alembic upgrade head
poetry run alembic downgrade -1 && poetry run alembic upgrade head
```

Veja [Banco de Dados › Migrações](/dev/database/migrations/).

## 3. Schemas de request e response

```python
# server/models/http/requests/equipment_request_models.py
class EquipmentRegister(BaseModel):
    name: str
    classroom_id: int


class EquipmentUpdate(EquipmentRegister):
    pass


# server/models/http/responses/equipment_response_models.py
class EquipmentResponse(BaseModel):
    id: int
    name: str
    classroom_id: int
    classroom_name: str

    @classmethod
    def from_equipment(cls, equipment: Equipment) -> "EquipmentResponse":
        return cls(
            id=must_be_int(equipment.id),
            name=equipment.name,
            classroom_id=equipment.classroom_id,
            classroom_name=equipment.classroom.name,
        )

    @classmethod
    def from_equipment_list(cls, items: list[Equipment]) -> list["EquipmentResponse"]:
        return [cls.from_equipment(item) for item in items]
```

Nunca devolva o model direto na rota: sempre um response com `from_<x>()`.

## 4. Dicts tipados

Crie `server/models/dicts/base/equipment_base_dict.py` (os campos de negócio, `total=False`) e `server/models/dicts/database/equipment_database_dicts.py` (com FKs e relacionamentos). Eles tipam os updates e as factories de teste do passo 8.

## 5. Repositório

```python
# server/repositories/equipment_repository.py
class EquipmentRepository:
    @staticmethod
    def get_all(*, session: Session) -> list[Equipment]:
        return list(session.exec(select(Equipment)).all())

    @staticmethod
    def get_by_id(*, id: int, session: Session) -> Equipment:
        equipment = session.get(Equipment, id)
        if equipment is None:
            raise EquipmentNotFound(id)
        return equipment

    @staticmethod
    def create(*, input: EquipmentRegister, session: Session) -> Equipment:
        equipment = Equipment(**input.model_dump())
        session.add(equipment)
        return equipment

    # update, delete...


class EquipmentNotFound(HTTPException):
    def __init__(self, id: int) -> None:
        super().__init__(status.HTTP_404_NOT_FOUND, f"Equipamento com id {id} não encontrado")
```

Métodos estáticos, `session` keyword-only, sem `commit` e sem checagem de permissão. As exceções de domínio ficam no fim do arquivo, com a mensagem em português.

## 6. Permissão e adapter (quando não é só admin)

Se o recurso é **só de admin**, o tier `admin` já basta: admin passa em qualquer checagem, e as rotas podem chamar o repositório direto (passo 7).

Se usuários não-admin também vão mexer nele (tier `restricted`), a permissão precisa ser checada por objeto:

1. **Checker** em `server/services/security/equipment_permission_checker.py`, estendendo `PermissionChecker[Equipment]`. Para um equipamento, o natural é reaproveitar a regra da sala: delegar ao `ClassroomPermissionChecker` com a ação correspondente.
2. **Adapter** em `server/deps/repository_adapters/equipment_repository_adapter.py`: recebe `UserDep`, `SessionDep` e `PermissionIndexDep` no `__init__`, monta o checker, e cada método checa, chama o repositório, faz `commit` e traduz `IntegrityError` em erro de domínio. Exporte `EquipmentRepositoryDep = Annotated[EquipmentRepositoryAdapter, Depends()]`.

Use o `classroom_repository_adapter.py` como modelo.

## 7. Rotas

```python
# server/routes/admin/equipment_admin_routes.py
router = APIRouter(prefix="/equipments", tags=["Equipments"])


@router.get("")
def get_all_equipments(session: SessionDep) -> list[EquipmentResponse]:
    return EquipmentResponse.from_equipment_list(EquipmentRepository.get_all(session=session))


@router.post("")
def create_equipment(input: EquipmentRegister, session: SessionDep) -> EquipmentResponse:
    try:
        equipment = EquipmentRepository.create(input=input, session=session)
        session.commit()
    except IntegrityError:
        raise EquipmentAlreadyExists(input.name)
    session.refresh(equipment)
    return EquipmentResponse.from_equipment(equipment)

# PUT /{id}, DELETE /{id} (devolve NoContent)...
```

Inclua o router no `__init__.py` do tier:

```python
# server/routes/admin/__init__.py
from server.routes.admin.equipment_admin_routes import router as AdminEquipmentRouter
# ...
router.include_router(AdminEquipmentRouter)
```

A URL final é `/api/admin/equipments`. Escolha o tier pela pergunta "quem pode chamar isso?" (veja [Rotas e tiers](/dev/backend/routes)). Se o mesmo recurso precisa de uma visão pública (por exemplo, mostrar os equipamentos no Mapa de Salas), crie também `server/routes/public/equipment_routes.py`, com um response que exponha só o necessário.

Se o corpo das requisições dessa rota deve aparecer nos logs, confira as regras de `LOG_BODY_RULES` em `server/middlewares/logger_middleware.py`, e acrescente a `SENSITIVE_BODY_KEYS` qualquer campo secreto. Veja o `docs/LOGGING.md` do backend.

## 8. Testes

1. **Factories:** `tests/factories/base/equipment_base_factory.py` (valores padrão com o Faker) e `tests/factories/model/equipment_model_factory.py` (com a sala e a sessão). Se for testar payloads, `tests/factories/request/equipment_request_factory.py`.
2. **Repositório:** `tests/integration/repositories/test_equipment_repository.py`, com a fixture `session`.
3. **Rotas:** `tests/api/admin/test_equipment_admin_routes.py`, com o `client` (admin). Teste também que `restricted_client` e `common_client` recebem 403.
4. **Checker e adapter**, se existirem: `tests/integration/services/security/` e `tests/integration/deps/repository_adapters/`.

```bash
poetry run pytest tests/api/admin/test_equipment_admin_routes.py
poetry run mypy server && poetry run ruff check server && poetry run ruff format server
```

Veja [Testes, lint e tipos](/dev/backend/testing).

## 9. Frontend e documentação

- **Frontend:** modelos HTTP, hook de serviço, hook de domínio, página e rota. Continue em [Frontend › Como adicionar uma funcionalidade](/dev/frontend/new-feature).
- **Enums novos** em `server/utils/enums/` precisam do equivalente em `src/utils/enums/` no frontend.
- **Banco:** adicione a tabela em [Tabelas, Modelos e Relacionamentos](/dev/database/models/).
- Se a mudança afeta o frontend, registre-a no `docs/CHANGELOG_FRONTEND.md` do backend.

## Checklist

- [ ] Model em `server/models/database/` e import em `server/db.py`
- [ ] Migração gerada, revisada, aplicada e com downgrade testado
- [ ] Request e response (`from_<x>()`) em `server/models/http/`
- [ ] Dicts em `server/models/dicts/{base,database}/`
- [ ] Repositório com métodos estáticos e exceções de domínio
- [ ] Checker e adapter, se o recurso não é só de admin
- [ ] Rotas no tier certo, incluídas no `__init__.py`
- [ ] Factories e testes (repositório, rotas, permissões)
- [ ] `pytest`, `mypy` e `ruff` limpos
- [ ] Frontend, enums espelhados e documentação
