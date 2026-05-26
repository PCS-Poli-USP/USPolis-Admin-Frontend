import * as yup from 'yup';

import { PermissionAction } from '../../../utils/enums/actions.enums';
import { Resource } from '../../../utils/enums/resources.enums';
import PermissionsValidator from '../../../utils/permissions/permissions.validator';

export interface PermissionForm {
  resource: Resource;
  actions: PermissionAction[];
  resource_id: number;
  all_resources: boolean;
  user_id?: number;
  role_id?: number;
}

export const schema = yup.object<PermissionForm>().shape({
  resource: yup
    .string()
    .required('Campo obrigatório')
    .test('is-valid-option', 'Selecione um tipo válido', (value) =>
      PermissionsValidator.isValidResource(value),
    ),
  actions: yup
    .array()
    .of(yup.string())
    .required('Campo obrigatório')
    .test(
      'resource-required',
      'Selecione um recurso antes de escolher uma ação',
      function (value) {
        const { resource } = this.parent;
        // Se não houver recurso, não deve haver ações selecionadas
        if (!resource) return Array.isArray(value) && value.length === 0;
        return true;
      },
    )
    .test('is-valid-option', 'Selecione um tipo válido', function (value) {
      const { resource } = this.parent;
      if (!resource) return true; // Se não houver recurso, não valida as ações
      if (!Array.isArray(value)) return false; // Deve ser um array de ações
      if (value.length === 0) return false; // Deve haver pelo menos uma ação selecionada
      if (value.find((action) => action === undefined)) {
        return false;
      }
      return PermissionsValidator.isValidActions(value as string[], resource);
    })
    .test(
      'is-valid-all-resources',
      'A ação selecionada não pode ser aplicada a todos os recursos',
      function (value) {
        const { resource, all_resources } = this.parent;
        if (all_resources) {
          return PermissionsValidator.actionsCanHaveAllResources(
            value as PermissionAction[],
            resource,
          );
        }
        return true;
      },
    ),
  resource_id: yup.number().when('all_resources', (allResources, schema) => {
    const isAllResources = Array.isArray(allResources)
      ? allResources[0]
      : allResources;
    if (isAllResources === false) {
      return schema
        .required('Campo obrigatório')
        .min(1, 'ID deve ser um número positivo');
    }
    return schema;
  }),
  all_resources: yup.boolean().required(),
  user_id: yup
    .number()
    .optional()
    .test('is-positive', 'ID deve ser um número positivo', (value) => {
      if (value === undefined) return true; // Permite que o campo seja opcional
      return value >= 0;
    }),
  role_id: yup
    .number()
    .optional()
    .test('is-positive', 'ID deve ser um número positivo', (value) => {
      if (value === undefined) return true; // Permite que o campo seja opcional
      return value >= 0;
    }),
});

export const defaultValues = {
  resource: '',
  all_resources: false,
  resource_id: 0,
  action: '',
  user_id: undefined,
  role_id: undefined,
};
