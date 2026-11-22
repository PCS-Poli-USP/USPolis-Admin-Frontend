---
prev:
  text: 'Frontend › Testes'
  link: '/dev/frontend/testing'

next:
  text: 'Banco de Dados'
  link: '/dev/database'
---

# Como adicionar uma funcionalidade

Este é o caminho completo para criar uma página que consome um recurso novo do backend. O exemplo usa um recurso fictício, **equipamentos** (`equipment`), gerenciado por admins. Se o recurso ainda não existe no backend, comece por [Backend › Como adicionar um recurso](/dev/backend/new-resource).

Antes de começar, leia [Estado global e camada de API](/dev/frontend/data) e [Formulários, componentes e tema](/dev/frontend/forms-ui): os passos abaixo seguem as camadas descritas lá.

## 1. Modelos HTTP

Crie os tipos que espelham os schemas do backend (`server/models/http/requests/equipment_request_models.py` e `.../responses/equipment_response_models.py`):

```ts
// src/models/http/requests/equipment.request.models.ts
export interface CreateEquipment {
  name: string;
  classroom_id: number;
}
export type UpdateEquipment = CreateEquipment;

// src/models/http/responses/equipment.response.models.ts
export interface EquipmentResponse {
  id: number;
  name: string;
  classroom_id: number;
  classroom_name: string;
}
```

Se o backend tiver um enum novo, crie o equivalente em `src/utils/enums/<nome>.enum.ts` com os mesmos valores.

## 2. Hook de serviço

```ts
// src/hooks/API/services/useEquipmentsService.ts
const useEquipmentsService = () => {
  const axios = useAxiosPrivate();

  const getAll = (): Promise<AxiosResponse<EquipmentResponse[]>> =>
    axios.get('/admin/equipments');
  const create = (data: CreateEquipment): Promise<AxiosResponse<EquipmentResponse>> =>
    axios.post('/admin/equipments', data);
  const update = (id: number, data: UpdateEquipment): Promise<AxiosResponse<EquipmentResponse>> =>
    axios.put(`/admin/equipments/${id}`, data);
  const deleteById = (id: number): Promise<AxiosResponse<undefined>> =>
    axios.delete(`/admin/equipments/${id}`);

  return { getAll, create, update, deleteById };
};

export default useEquipmentsService;
```

Use `useAxiosPrivate()` para qualquer rota que precise de sessão. A instância pública (`services/api/axios.ts`) é só para rotas públicas.

## 3. Hook de domínio e parser de erro

```bash
src/hooks/equipments/
├── useEquipments.ts           # estado + toasts + recarregar a lista
└── equipmentErrorParser.ts    # class EquipmentErrorParser extends ErrorParser { super('Equipamento') }
```

Siga a forma de `src/hooks/classrooms/useClassrooms.ts`: `loading`, a lista em `useState`, funções em `useCallback` que chamam o serviço, mostram o toast (`useCustomToast`) e, depois de criar/atualizar/remover, recarregam a lista. Um parâmetro `initialFetch = true` controla se a lista é buscada ao montar.

## 4. Validador de domínio

Coloque as regras em `src/utils/equipments/equipments.validator.ts`, como uma classe com métodos estáticos que estende o `CommonValidator`. Crie também um `equipments.validator.test.ts` ao lado: é o teste mais barato de escrever (veja [Testes](/dev/frontend/testing)).

## 5. Página, tabela e modal

```bash
src/pages/equipments/
├── equipments.tsx                       # página: PageContent + PageHeader + DataTable + modal
├── Tables/
│   └── equipment.tables.tsx             # getEquipmentColumns(): ColumnDef<EquipmentResponse>[]
└── EquipmentModal/
    ├── equipment.modal.tsx              # useForm + yupResolver + FormProvider + campos do kit
    ├── equipment.modal.form.ts          # formFields, schema, defaultValues
    └── equipment.modal.interface.ts     # EquipmentForm e EquipmentModalProps extends ModalProps
```

- Use os componentes de moldura de `components/common` (`PageContent`, `PageHeader`) para a página ficar igual às outras.
- Use o `DataTable` para a listagem e os helpers de `utils/tanstackTableHelpers/` nos filtros.
- O modal recebe `isOpen`/`onClose` pelo contrato `ModalProps` (`src/models/interfaces/modalProps.ts`).
- Todos os textos em pt-BR.
- Siga a convenção de nome dos arquivos vizinhos (veja [Estrutura de arquivos › Convenções de nome](/dev/frontend/structure#convencoes-de-nome)).

## 6. Rota, menu e hub

1. **Rota** em `src/AppRoutes.tsx`, dentro do grupo com a guarda certa. Para uma página de admin, dentro de `<Route path='admin' element={<AdminRoute />}>`:

   ```tsx
   <Route path='equipments' element={<Equipments />} />
   ```

2. **Link no menu lateral** em `src/components/common/EmptyPage/drawer.body.tsx`, na seção correspondente (aqui, a de admin).
3. **Card no hub** do grupo (aqui, `src/pages/adminHub/index.tsx`), se o grupo tiver um hub.

Lembre que a guarda do frontend só esconde a tela: o backend precisa proteger a rota da API (veja [Rotas e controle de acesso](/dev/frontend/routing)).

## 7. Testes, lint e tipos

```bash
yarn test
yarn lint
npx tsc --noEmit
```

Nenhum dos três roda no CI nem bloqueia o build, então rode-os antes de abrir o PR.

## 8. Documentação

- Se a funcionalidade é visível para usuários, crie ou atualize a página correspondente nos guias desta documentação (`docs/`, fora de `docs/dev/`) e adicione o item na sidebar em `docs/.vitepress/config.ts`.
- Registre a mudança no changelog do ano (`docs/changelog/<ano>.md`).
- Se você mudou a arquitetura (um contexto novo, uma camada nova), atualize esta seção de referência.

## Checklist

- [ ] Modelos de request/response espelhando o backend
- [ ] Enums novos em `src/utils/enums/`
- [ ] Hook de serviço em `hooks/API/services/`
- [ ] Hook de domínio + `ErrorParser` em `hooks/<domínio>/`
- [ ] Validador em `utils/<domínio>/` com teste
- [ ] Página, `Tables/` e modal com o trio `.form.ts`/`.interface.ts`/`.tsx`
- [ ] Rota no `AppRoutes.tsx` com a guarda certa, link no menu e card no hub
- [ ] `yarn test`, `yarn lint` e `npx tsc --noEmit` limpos
- [ ] Docs de usuário e changelog
