---
prev:
  text: 'Frontend › Estado global e camada de API'
  link: '/dev/frontend/data'

next:
  text: 'Frontend › Testes'
  link: '/dev/frontend/testing'
---

# Formulários, componentes e tema

## Formulários

Os formulários usam **react-hook-form** com validação **Yup**, ligados pelo `yupResolver` de `@hookform/resolvers`.

> [!NOTE]
> O `formik` ainda aparece no `package.json`, mas nenhum formulário da aplicação o usa. Não escreva formulários novos com Formik: os campos do kit dependem do contexto do react-hook-form.

### O trio de arquivos

Cada formulário separa três coisas em arquivos diferentes, lado a lado na pasta do modal:

| Arquivo | Conteúdo |
|---|---|
| `<nome>.form.ts` | O schema Yup e os valores padrão |
| `<nome>.interface.ts` | O tipo do formulário e as props do modal |
| `<nome>.tsx` | A marcação: `useForm`, `FormProvider` e os campos |

O `.form.ts` segue sempre o mesmo formato: um objeto com o validador e o valor padrão de cada campo, e dele saem o schema e os valores padrão. Nos formulários de uma etapa os exports se chamam `formFields`, `schema` e `defaultValues`; nas etapas de um wizard levam o prefixo da etapa (`classFirstFormFields`, `classFirstSchema`, `classFirstDefaultValues`). Exemplo resumido de `src/pages/classrooms/ClassroomModal/classroom.modal.form.ts`:

```ts
export const formFields = {
  name: {
    validator: yup
      .string()
      .required('Campo obrigatório')
      .test('is-valid-option', 'Campo obrigatório',
        (value) => !ClassroomValidator.isInvalidName(value)),
    defaultValue: '',
  },
  capacity: {
    validator: yup.number().required('Campo obrigatório')
      .test('is-valid-capacity', 'Campo obrigatório',
        (value) => !ClassroomValidator.isInvalidCapacity(value)),
    defaultValue: 0,
  },
  // ...
};

export const schema = yup.object<ClassroomForm>().shape({
  name: formFields.name.validator,
  capacity: formFields.capacity.validator,
  // ...
});

export const defaultValues: ClassroomForm = {
  name: formFields.name.defaultValue,
  capacity: formFields.capacity.defaultValue,
  // ...
};
```

E no modal:

```tsx
const form = useForm<ClassroomForm>({
  defaultValues,
  resolver: yupResolver(schema),
});

return (
  <FormProvider {...form}>
    <Input label='Nome' name='name' />
    <NumberInput label='Capacidade' name='capacity' />
  </FormProvider>
);
```

Para preencher o formulário ao editar, os modais chamam `form.reset({...})` com os dados do item selecionado. Ao fechar, chamam `reset(defaultValues)`.

### Validadores de domínio

As regras de validação não ficam dentro do schema: ficam em `src/utils/<domínio>/<domínio>.validator.ts`, como classes com métodos estáticos que estendem o `CommonValidator` (`src/utils/common/common.validator.ts`):

```ts
export class ClassroomValidator extends CommonValidator {
  static isInvalidName(value: string) {
    return this.isEmptyString(value);
  }
  static isInvalidCapacity(value: number) {
    return value < 0;
  }
}
```

Assim a mesma regra serve ao schema Yup (no `.test(...)`) e a checagens fora do formulário. Os validadores são o melhor lugar para começar a escrever testes unitários (veja `src/utils/classrooms/classrooms.validator.test.ts`).

### Formulários em várias etapas

Modais com várias etapas, como o de turmas (`src/pages/classes/ClassModal/`), têm uma pasta `Steps/` com uma subpasta por etapa, cada uma com o seu trio:

```bash
ClassModal/
├── class.modal.tsx                  # cria um useForm por etapa e controla o Stepper
├── class.modal.interface.ts
├── class.modal.schedule.form.ts
└── Steps/
    ├── class.modal.steps.interface.ts
    ├── First/   class.modal.steps.first.{form.ts,interface.ts,tsx}
    ├── Second/  ...
    ├── Third/   ...
    ├── Fourth/  ...
    ├── Fifth/   class.modal.steps.fifth.{interface.ts,tsx}   # etapa de revisão, sem schema
    └── ScheduleList/                                          # componente auxiliar
```

O modal pai cria **um `useForm` por etapa** e passa cada um para a sua etapa como prop (`form: UseFormReturn<...>`). A etapa envolve os próprios campos em `<FormProvider {...props.form}>`. Ao clicar em "Próximo", o pai chama `trigger()` no formulário da etapa atual e só avança se ele for válido. No envio, junta os valores de todas as etapas.

Nem toda etapa tem schema: etapas de revisão ou que só exibem dados têm apenas `.interface.ts` e `.tsx`.

### Kit de formulário

Os campos reaproveitáveis ficam em `src/components/common/form/`, uma pasta por campo, e são reexportados por `src/components/common/index.ts`:

| Campo | Observação |
|---|---|
| `Input`, `NumberInput`, `TextareaInput` | Texto e números |
| `SelectInput`, `MultiSelectInput` | Seleção simples e múltipla (`MultiSelectInput` usa o `chakra-react-select`) |
| `CheckBox`, `SwitchInput` | Booleanos |
| `ListInput` | Lista de strings (ex: professores) |
| `RadioButton` | Grupo de rádio controlado do Chakra (`value`/`onChange`). **Não** lê o formulário |
| `ImageDropzone` | Upload de imagens com `react-dropzone`. **Não** lê o formulário e não é reexportado pelo `index.ts` |

Todos os campos, exceto `RadioButton` e `ImageDropzone`, leem o formulário com `useFormContext()` e se registram pelo `name`. Por isso **precisam estar dentro de um `FormProvider`**: fora dele, o componente quebra ao renderizar. Eles recebem as props comuns de `form.interface.ts` (`label`, `name`, `placeholder`, `disabled`, margens) e mostram a mensagem de erro do Yup automaticamente. O tipo `Option` (`form.types.ts`) é o formato `{ label, value }` usado pelos selects.

## Tabelas

As listagens usam o `DataTable` (`src/components/common/DataTable/dataTable.component.tsx`), um componente genérico sobre o `@tanstack/react-table` v8 com ordenação, filtros por coluna, paginação e colunas fixas (`columnPinning`).

Cada página define as próprias colunas em `Tables/<nome>.table(s).tsx`, como um `ColumnDef<T>[]`, e as passa para o `DataTable` junto com os dados:

```tsx
<DataTable
  loading={loading}
  data={classrooms}
  columns={columns} // getClassroomColumns(...)
  columnPinning={{ left: ['name'], right: ['options'] }}
/>
```

As funções de filtro e ordenação compartilhadas (`FilterNumber`, `FilterBoolean`, `FilterArray`, `SortPeriodFn`...) ficam em `src/utils/tanstackTableHelpers/` e são usadas no `filterFn`/`sortingFn` das colunas.

## Calendários e datas

- **FullCalendar 6** (com os plugins de timegrid, resource e rrule) é a base do Mapa de Salas e das grades de horário. Os componentes compartilhados ficam em `components/common/ClassroomCalendar/` e `components/common/ClassroomTimeGrid/`, e a página do Mapa de Salas tem os seus em `pages/allocation/`.
- **MUI x-date-pickers**: o `DateCalendar` é usado em `components/common/DateCalendarPicker/` (calendário com marcadores por dia). O `LocalizationProvider` do `main.tsx` configura o `AdapterMoment` com locale `pt-br`.
- **moment** é a biblioteca de datas. O locale `pt-br` é importado no `main.tsx` e no `AppRoutes.tsx`.
- PDFs (relatórios do Mapa de Salas) são gerados no navegador com `@react-pdf/renderer`, em `pages/allocation/pdf/`.

## Tema e modo escuro

`src/utils/theme.ts` exporta dois temas:

- `chakraTheme`: o tema principal (`extendTheme`), com modo inicial claro, a paleta `uspolis` e os **tokens semânticos** `uspolis.*` que mudam de valor entre os modos claro e escuro: `uspolis.blue`, `uspolis.red`, `uspolis.gray`, `uspolis.lightGray`, `uspolis.white`, `uspolis.black`, `uspolis.text`, `uspolis.yellow`, `uspolis.textMuted`, `uspolis.border`, `uspolis.surfaceSubtle` e `uspolis.hover`. Também sobrescreve estilos de alguns componentes.
- `muiTheme`: o tema do MUI (`createTheme` com `colorSchemes: { dark: true }`), usado pelo shell do layout (`Drawer`, `AppBar`) e pelos seletores de data.

O modo escuro é trocado pelo `useColorMode` do Chakra, e quem troca também chama `useColorScheme().setMode(...)` do MUI, para os dois temas ficarem sincronizados (veja `components/common/EmptyPage/drawer.navbar.tsx`). Se você criar outro botão de tema, faça as duas chamadas.

> [!IMPORTANT]
> Os tokens `uspolis.*` **trocam de valor** entre os modos: `uspolis.black` vira branco no modo escuro, e `uspolis.white` vira cinza-escuro. Use os tokens para fundo e texto que devem acompanhar o tema. Se você precisa de uma cor que **sempre** parece igual (ex: um bloco de código com fundo sempre escuro), use um valor hexadecimal fixo: usar o token nesse caso inverte as cores no modo escuro.

## MUI e Chakra juntos

O Chakra é a biblioteca padrão para tudo que é novo. O MUI aparece em pontos específicos:

- o shell do layout (`EmptyPage`, com `Drawer`, `AppBar`, `Box` e `styled` do `@mui/material`);
- os seletores de data do `@mui/x-date-pickers`;
- alguns `Tooltip` e `Badge` isolados.

Evite misturar as duas bibliotecas no mesmo componente sem necessidade.

## Enums

`src/utils/enums/` tem enums TypeScript que espelham os enums do backend (`server/utils/enums/`): tipos de turma, dias da semana, recorrência, tipos de conflito, ações e recursos de permissão, status de API key, etc. Use sempre o enum em vez da string solta. Quando um enum muda no backend, ele precisa ser atualizado aqui também.

## Textos

Todos os textos visíveis ao usuário estão em português (pt-BR), escritos direto no código: não há biblioteca de internacionalização. Os comentários de código são, na maioria, em inglês.
