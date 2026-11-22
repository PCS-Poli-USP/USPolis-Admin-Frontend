---
prev:
  text: 'Backend › Estrutura de arquivos'
  link: '/dev/backend/structure'

next:
  text: 'Backend › Fluxo de uma requisição'
  link: '/dev/backend/request-flow'
---

# Rotas e tiers

As rotas ficam em `server/routes/`, divididas por **nível de acesso** (tier). Cada tier é uma pasta com um `__init__.py` que cria um `APIRouter` com a dependência de autenticação daquele nível e inclui os routers de cada recurso. A autenticação é aplicada **no router do tier inteiro**, não em cada handler:

```python
# server/routes/restricted/__init__.py
router = APIRouter(dependencies=[Depends(restricted_authenticate)], tags=["Restricted"])
router.include_router(BuildingRouter)
router.include_router(ClassroomRouter)
# ...
```

Todas as URLs abaixo são relativas a `/api` (o `root_path` da aplicação).

## Os tiers

| Tier | Pasta | Dependência | Quem passa |
|---|---|---|---|
| health | `routes/health/` | `health_token_authenticate` (no router de `/health`) | Quem envia `X-API-Key` igual a `HEALTH_API_KEY` |
| public | `routes/public/` | `public_authenticate` | Todo mundo. Se houver sessão, o usuário fica disponível, mas nada é exigido |
| authenticated | `routes/authenticated/` | `authenticate` | Qualquer usuário logado |
| restricted | `routes/restricted/` | `restricted_authenticate` | Admin, ou usuário com pelo menos um grupo ou papel |
| admin | `routes/admin/` | `admin_authenticate`, com prefixo `/admin` | Só admin |
| dev | `routes/dev/` | `admin_authenticate` | Só admin, e o router só é montado em desenvolvimento |

O que cada dependência faz por dentro está em [Autenticação e permissões](/dev/backend/auth).

O **mesmo recurso** costuma ter rotas em mais de um tier, com níveis de detalhe diferentes. As salas, por exemplo, têm rotas em `public` (o que o Mapa de Salas mostra), `authenticated` (o que um usuário logado pode consultar) e `restricted` (criar, editar, remover). O módulo tem o mesmo nome nas três pastas: `classroom_routes.py`.

> [!IMPORTANT]
> O tier é só a **primeira** barreira. Passar pelo `restricted` não quer dizer que o usuário pode editar qualquer sala: as checagens por objeto são feitas pelos permission checkers, chamados pelos adapters (veja [Fluxo de uma requisição](/dev/backend/request-flow)).

## health

| Módulo | Prefixo | Rotas |
|---|---|---|
| `health_routes.py` | `/health` | `GET ""`, `GET /database`, `POST /user-schedules/invalidate-expired` |

Usada pelo monitoramento externo do sistema. A chave `HEALTH_API_KEY` não é uma [API key de parceiro](/api-keys/), apesar de usar o mesmo header. Sem `HEALTH_API_KEY` configurada, ninguém entra.

> [!WARNING]
> O `ApiKeyMiddleware` trata **todo** header `X-API-Key` como chave de parceiro e não abre exceção para `/health`. Uma `HEALTH_API_KEY` que não tem o formato de chave de parceiro é recusada pelo middleware (401) antes de chegar à rota. Leve isso em conta se for mexer no health-check.

## public

| Módulo | Prefixo |
|---|---|
| `auth_routes.py` | `/auth` (`get-tokens`, `refresh-token`, `logout`) |
| `allocation_routes.py` | `/allocations` |
| `building_routes.py` | `/buildings` |
| `classroom_routes.py` | `/classrooms` |
| `subject_routes.py` | `/subjects` |
| `class_routes.py` | `/classes` |
| `course_routes.py` | `/courses` |
| `curriculum_routes.py` | `/curriculums` |
| `curriculum_subject_routes.py` | `/curriculum_subjects` |
| `occurrence_routes.py` | `/occurrences` |
| `reservation_routes.py` | `/reservations` |
| `exam_routes.py` | `/reservations/exams` (montado dentro do router de reservas) |
| `event_routes.py` | `/reservations/events` (idem) |
| `meeting_routes.py` | `/reservations/meetings` (idem) |
| `search_routes.py` | `/search` (`GET ""` e `GET /documents/{doc_key}`, veja [Busca geral](/dev/search/)) |
| `api_key_link_routes.py` | `/api-key-links` (o parceiro revela a chave pelo link de uso único) |
| `static_routes.py` | `/static` (imagens dos e-mails) |
| `mobile_google_authentication_routes.py` | `/mobile/authentication` (exige o ID token do Google do app) |
| `mobile_classes_routes.py` | `/mobile/classes` |
| `mobile_institutional_events_routes.py` | `/mobile/institutional-events` |
| `mobile_comments_routes.py` | `/mobile/comments` |
| `forum_routes.py` | `/mobile/forum` |

As rotas `/mobile/*` atendem o app USPolis Mobile (veja [Arquitetura](/dev/architecture)). As rotas públicas são as únicas que aceitam [API keys de parceiros](/api-keys/).

## authenticated

| Módulo | Prefixo |
|---|---|
| `user_routes.py` | `/users` (o próprio usuário: `GET /users`, `/users/my-buildings`, ...) |
| `user_schedule_routes.py` | `/users/schedules` (grade horária pessoal) |
| `building_routes.py` | `/buildings` |
| `classroom_routes.py` | `/classrooms` |
| `subject_routes.py` | `/subjects` |
| `class_routes.py` | `/classes` |
| `calendar_routes.py` | `/calendars` |
| `holiday_category_routes.py` | `/holidays_categories` |
| `holiday_routes.py` | `/holidays` |
| `institutional_event_routes.py` | `/institutional_events` |
| `solicitation_routes.py` | `/solicitations` (o usuário pedindo uma sala) |
| `feedback_routes.py` | `/feedbacks` |
| `bug_report_routes.py` | `/reports` |

## restricted

| Módulo | Prefixo |
|---|---|
| `building_routes.py` | `/buildings` |
| `classroom_routes.py` | `/classrooms` |
| `subject_routes.py` | `/subjects` (inclui o crawl do JupiterWeb) |
| `class_routes.py` | `/classes` |
| `calendar_routes.py` | `/calendars` |
| `holiday_category_routes.py` | `/holidays_categories` |
| `holiday_routes.py` | `/holidays` |
| `institutional_event_routes.py` | `/institutional_events` |
| `schedule_routes.py` | `/schedules` |
| `occurrence_routes.py` | `/occurrences` |
| `allocation_routes.py` | `/allocations` |
| `allocation_log_routes.py` | `/allocations_logs` |
| `conflict_routes.py` | `/conflicts` |
| `reservation_routes.py` | `/reservations` |
| `exam_routes.py`, `event_routes.py`, `meeting_routes.py` | `/reservations/exams`, `/reservations/events`, `/reservations/meetings` |
| `solicitation_routes.py` | `/solicitations` (o gestor aprovando ou negando) |

## admin

Todo o tier tem o prefixo `/admin`.

| Módulo | Prefixo |
|---|---|
| `user_admin_routes.py` | `/admin/users` |
| `user_session_admin_routes.py` | `/admin/sessions/users` |
| `roles_admin_routes.py` | `/admin/roles` |
| `permissions_admin_routes.py` | `/admin/permissions` |
| `group_admin_routes.py` | `/admin/groups` |
| `building_admin_routes.py` | `/admin/buildings` |
| `course_admin_routes.py` | `/admin/courses` |
| `curriculum_admin_routes.py` | `/admin/curriculums` |
| `curriculum_subject_admin_routes.py` | `/admin/curriculum_subjects` |
| `feedback_admin_routes.py` | `/admin/feedbacks` |
| `bug_report_admin_routes.py` | `/admin/reports` |
| `bug_report_evidence_admin_routes.py` | `/admin/reports/evidences` |
| `api_access_log_admin_routes.py` | `/admin/api-access-logs` |
| `api_incident_report_admin_routes.py` | `/admin/api-incident-reports` |
| `api_key_admin_routes.py` | sem prefixo próprio: `/admin/api-clients/...`, `/admin/api-keys/{key_id}/...` e `/admin/api-key-delivery-links/{id}/invalidate` |
| `mobile_admin_routes.py` | `/admin/mobile/authentication` |

## dev

| Módulo | Prefixo | Rotas |
|---|---|---|
| `jupiter_debug_routes.py` | `/dev/jupiter` | `POST /scrape`: roda o crawler autenticado do JupiterWeb e devolve o resultado |
| `error_debug_routes.py` | `/dev/errors` | `GET /uncaught`: lança uma exceção não tratada, para testar logs e alertas |

> [!WARNING]
> O `app.py` só monta o `DevRouter` quando `CONFIG.environment == "development"`, e a comparação diferencia maiúsculas de minúsculas. O ambiente Docker (o `.env.example` do USPolis-Admin) usa `ENVIRONMENT=DEVELOPMENT`, e com esse valor **as rotas de dev não são montadas**. No ambiente manual, escreva `development` em minúsculas no `.env.dev` se precisar delas. O resto do código (`CONFIG.development`, o `wsgi.py`) compara em minúsculas e trata os dois valores como desenvolvimento.

## Recursos aninhados

Prova, evento e reunião são especializações de reserva (veja [Banco de Dados › A tabela `reservation` como "hub" central](/dev/database/#a-tabela-reservation-como-hub-central)). Por isso os routers delas são incluídos **dentro** do router de reservas, e as URLs ficam `/reservations/exams`, `/reservations/events` e `/reservations/meetings`, tanto no tier `public` quanto no `restricted`.

## Convenções dos handlers

- O handler recebe o **adapter** do recurso como dependência (`repository: ClassroomRepositoryDep`) e só chama um método dele. Regra de negócio, permissão e `commit` ficam no adapter.
- O retorno é um schema de response construído com um classmethod `from_<x>()`, como `ClassroomResponse.from_classroom(classroom)`.
- Remoções devolvem `NoContent` (`server/models/http/responses/generic_responses.py`). Algumas escritas devolvem um `JSONResponse` com uma mensagem em português.
- Listagens paginadas recebem `PaginationDep` e devolvem `PaginatedResponse` (`paginated_response_models.py`).

```python
@router.put("/{id}")
def update_classroom(
    id: int,
    input: ClassroomUpdate,
    repository: ClassroomRepositoryDep,
) -> ClassroomResponse:
    classroom = repository.update(id, input)
    return ClassroomResponse.from_classroom(classroom)
```
