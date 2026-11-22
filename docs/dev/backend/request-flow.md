---
prev:
  text: 'Backend › Rotas e tiers'
  link: '/dev/backend/routes'

next:
  text: 'Backend › Autenticação e permissões'
  link: '/dev/backend/auth'
---

# Fluxo de uma requisição

Esta página segue uma requisição real, `PUT /api/classrooms/{id}` (editar uma sala, tier `restricted`), por todas as camadas do backend. Os outros recursos seguem o mesmo caminho.

```text
PUT /api/classrooms/7
 │
 ├─ 1. Middlewares          Logger → CORS → ApiKey → RateLimit
 ├─ 2. Tier                 restricted_authenticate: sessão + grupo
 ├─ 3. Handler              update_classroom(id, input, repository)
 │                          (o FastAPI monta o adapter)
 ├─ 4. Adapter              repository.update(7, input)
 │    ├─ 5. Checker         check_permission(7, UPDATE) → 403?
 │    ├─ 6. Repositório     ClassroomRepository.update(...)
 │    └─ commit()
 ├─ 7. Sessão e model       Session da requisição, Classroom
 └─ 8. Response             ClassroomResponse.from_classroom(...)
```

## 1. Middlewares

A requisição passa por `LoggerMiddleware` → `CORSMiddleware` → `ApiKeyMiddleware` → `RateLimitMiddleware` antes de chegar à rota (veja [Visão geral › Middlewares](/dev/backend/#middlewares)). Ela pode parar aqui: 429 do rate limit, 401 de uma API key inválida, 400 se a chave vier na URL.

## 2. Dependência do tier

O router de `restricted` declara `Depends(restricted_authenticate)`. Essa função depende de `authenticate`, que tenta o token Bearer do Google e, se não houver, o cookie `session`. Depois exige que o usuário seja admin ou tenha algum grupo. Detalhes em [Autenticação e permissões](/dev/backend/auth).

O FastAPI guarda o resultado de cada dependência durante a requisição: o `User` resolvido aqui é o mesmo objeto que o handler e o adapter recebem, sem consultar o banco de novo.

## 3. Handler

```python
# server/routes/restricted/classroom_routes.py
@router.put("/{id}")
def update_classroom(
    id: int,
    input: ClassroomUpdate,
    repository: ClassroomRepositoryDep,
) -> ClassroomResponse:
    classroom = repository.update(id, input)
    return ClassroomResponse.from_classroom(classroom)
```

O handler é curto de propósito. O FastAPI valida o corpo contra o schema `ClassroomUpdate` (Pydantic, em `server/models/http/requests/`), e o handler só chama o adapter e converte o resultado num response.

## 4. Adapter

```python
# server/deps/repository_adapters/classroom_repository_adapter.py
class ClassroomRepositoryAdapter:
    def __init__(
        self,
        owned_building_ids: OwnedBuildingIdsDep,
        session: SessionDep,
        user: UserDep,
        permission_index: PermissionIndexDep,
    ):
        self.session = session
        self.user = user
        self.classroom_checker = ClassroomPermissionChecker(
            user=user, session=session, permission_index=permission_index
        )
        # ...

    def update(self, classroom_id: int, input: ClassroomUpdate) -> Classroom:
        self.classroom_checker.check_permission(classroom_id, ClassroomAction.UPDATE)
        classroom = ClassroomRepository.update(
            id=classroom_id, input=input, session=self.session
        )
        self.__update_groups_classrooms(classroom=classroom, input=input)
        self.session.commit()
        self.session.refresh(classroom)
        return classroom


ClassroomRepositoryDep = Annotated[ClassroomRepositoryAdapter, Depends()]
```

O adapter é uma classe cujo `__init__` recebe dependências do FastAPI. O `Depends()` sem argumento faz o FastAPI instanciá-la, resolvendo essas dependências. É a camada que:

- **checa a permissão** de cada operação, com os permission checkers que ela mesma monta (uma vez por requisição);
- **orquestra** um ou mais repositórios (aqui, a sala e os grupos dela);
- **faz o `commit`**. Os repositórios só fazem `add`/`flush`, então uma operação que mexe em várias tabelas é uma transação só;
- **traduz erros de banco** em erros de domínio. No `create`, um `IntegrityError` vira `ClassroomNameAlreadyExists` (409, "Sala com o nome X já existe").

Nem todo recurso tem adapter. Hoje existem para building, class, classroom, event, exam, meeting, occurrence, reservation, schedule, solicitation e subject. Recursos mais simples chamam o repositório direto na rota, e aí é o handler que faz o `commit`.

## 5. Permission checker

```python
# server/services/security/classrooms_permission_checker.py (resumido)
class ClassroomPermissionChecker(PermissionChecker[Classroom]):
    def check_permission(self, object, action: ClassroomAction) -> None:
        if self.user.is_admin:
            return
        # aceita int, Classroom ou listas: cada sala precisa passar em is_allowed(), senão 403

    def is_allowed(self, classroom_id: int, action: ClassroomAction, building_id=None) -> bool:
        if classroom_id in self.user.classrooms_ids_set():  # sala de um grupo do usuário
            return True
        return self.permission_index.has_classroom_permission(  # ou concedida por um papel
            action=action, classroom_id=classroom_id, building_id=building_id
        )
```

Cada checker estende `PermissionChecker[M]` (`base_permission_checker.py`) e implementa `check_permission(objeto, ação)`, aceitando um id, um objeto ou uma lista de qualquer um dos dois. Admin passa sempre. Os outros usuários passam se o objeto pertence a um dos seus **grupos** ou se um dos seus **papéis** concede aquela ação. Senão, o checker lança uma `HTTPException` 403 com a mensagem em português. O modelo de permissões está em [Autenticação e permissões](/dev/backend/auth#permissoes-por-objeto).

## 6. Repositório

```python
# server/repositories/classroom_repository.py (resumido)
class ClassroomRepository:
    @staticmethod
    def get_by_id(*, id: int, session: Session) -> Classroom: ...

    @staticmethod
    def create(*, input: ClassroomRegister, creator: User, session: Session) -> Classroom:
        new_classroom = Classroom(**input.model_dump(), created_by=creator, ...)
        session.add(new_classroom)
        return new_classroom


class ClassroomNotFound(HTTPException):
    def __init__(self, id: int):
        super().__init__(status_code=404, detail=f"Sala com id {id} não encontrada")
```

Convenções dos repositórios:

- classe com **métodos estáticos**, e a `session` sempre como argumento keyword-only (`*, session`);
- só consulta e escreve: **não checa permissão e não faz `commit`**;
- as exceções de domínio (`ClassroomNotFound`, ...) são subclasses de `HTTPException` definidas no fim do próprio arquivo.

Exceções ao padrão: `ApiClientRepository` usa `@classmethod`, `CourseOptionRepository` recebe a sessão no construtor, e os repositórios de permissão (`building_`, `classroom_` e `course_permission_repository.py`) herdam de um `PermissionRepository[P, A]` genérico.

## 7. Sessão e model

A `Session` vem de `SessionDep` (`server/deps/session_dep.py`), que usa o `get_db()` de `server/db.py`: uma sessão por requisição, aberta e fechada em volta dela. O engine tem um pool por worker (`DB_POOL_SIZE`, `DB_MAX_OVERFLOW`, `DB_POOL_RECYCLE_SECONDS`).

O model (`server/models/database/classroom_db_model.py`) é só a tabela. Ele não é usado como schema da API: request e response são classes Pydantic separadas, para que colunas internas nunca sejam serializadas por engano (veja [Banco de Dados](/dev/database/)).

## 8. Response

`ClassroomResponse.from_classroom(classroom)` monta o JSON de saída a partir do model, lendo os relacionamentos necessários (grupos, prédio). Todo response tem um classmethod `from_<x>()` desse tipo, às vezes com variações (listas, respostas "full" com mais campos).

## Dependências reutilizáveis

Todas ficam em `server/deps/` e são aliases `Annotated[T, Depends(...)]`, prontos para usar como tipo de parâmetro:

| Alias | Arquivo | O que entrega |
|---|---|---|
| `SessionDep` | `session_dep.py` | A `Session` da requisição |
| `UserDep` | `authenticate.py` | O usuário autenticado (401 se não houver) |
| `BuildingDep` | `authenticate.py` | O prédio do header `building-id`, se o usuário tiver acesso a ele |
| `PermissionIndexDep` | `permission_index_dep.py` | O índice das permissões dos papéis do usuário, montado uma vez por requisição |
| `OwnedBuildingIdsDep` | `owned_building_ids.py` | Os ids dos prédios do usuário (todos, para admin) |
| `PaginationDep` | `pagination_dep.py` | `page` e `page_size` da query string, com limites |
| `QueryIntervalDep` | `interval_dep.py` | Um intervalo de datas da query string (hoje, ou `start` + `end`, até 366 dias) |
| `ConflictCheckerDep` | `conflict_checker.py` | O verificador de conflitos de horário |
| `<Recurso>RepositoryDep` | `repository_adapters/` | O adapter do recurso |

## Dicts tipados

`server/models/dicts/` tem `TypedDict`s em três grupos: `base/` (os campos de cada entidade), `database/` e `requests/`. Eles tipam os dicionários passados para métodos de update e, principalmente, os argumentos das factories de teste (veja [Testes, lint e tipos](/dev/backend/testing)). Ao adicionar um campo a um model, atualize o dict correspondente.
