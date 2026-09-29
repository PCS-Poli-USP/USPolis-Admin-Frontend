import * as yup from 'yup';

import { PermissionAction } from '../../../utils/enums/actions.enums';
import { Resource } from '../../../utils/enums/resources.enums';
import PermissionsValidator from '../../../utils/permissions/permissions.validator';

export interface IPermissionForm {
  resource: Resource;
  actions: PermissionAction[];
  resource_id: number;
  resource_ids?: number[];
  resource_name?: string;
  all_resources: boolean;
  role_id?: number;
}

export const schema = yup.object<IPermissionForm>().shape({
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
      'resource-required',
      'Selecione um recurso antes de escolher uma ação',
      function () {
        const { resource } = this.parent;
        // Se não houver recurso, não deve haver ações selecionadas
        if (!resource) return false;
        return true;
      },
    )

    .test(
      'is-valid-all-resources',
      'A ação selecionada não pode ser aplicada a todos os recursos',
      function (value) {
        const { resource, all_resources } = this.parent;
        if (all_resources) {
          const cantHaveAllResources = value.filter(
            (action) =>
              action != undefined &&
              !PermissionsValidator.actionCanHaveAllResources(
                action as PermissionAction,
                resource as Resource,
              ),
          );
          if (cantHaveAllResources.length > 0) {
            if (cantHaveAllResources.length === 1) {
              return this.createError({
                message: `A ação ${PermissionAction.translate(
                  cantHaveAllResources[0] as PermissionAction,
                  resource as Resource,
                )} não pode ser aplicada a todos os recursos`,
              });
            }
            return this.createError({
              message: `As ações ${cantHaveAllResources.map((action) => PermissionAction.translate(action as PermissionAction, resource as Resource)).join(', ')} não podem ser aplicadas a todos os recursos`,
            });
          }
        }
        return true;
      },
    )
    .test(
      'must-have-all-resources',
      'Uma das ações exige que todos os recursos sejam selecionados',
      function (value) {
        const { all_resources } = this.parent;
        if (!all_resources) {
          const mustHaveActions = value.filter((action) =>
            PermissionsValidator.actionMustHaveAllResources(
              action as PermissionAction,
            ),
          );
          if (mustHaveActions.length > 0) {
            if (mustHaveActions.length === 1) {
              return this.createError({
                message: `A ação ${PermissionAction.translate(
                  mustHaveActions[0] as PermissionAction,
                  this.parent.resource as Resource,
                )} exige que "Todos os recursos" seja selecionado`,
              });
            }
            return this.createError({
              message: `As ações ${mustHaveActions.map((action) => PermissionAction.translate(action as PermissionAction, this.parent.resource as Resource)).join(', ')} exigem que "Todos os recursos" seja selecionado`,
            });
          }
        }
        return true;
      },
    ),
  resource_id: yup
    .number()
    .required('Campo obrigatório')
    .test('Campo obrigatório', function (value) {
      const { actions, all_resources } = this.parent;
      const mustBeAllResources = Array.isArray(actions)
        ? actions.filter((action) =>
            PermissionsValidator.actionMustHaveAllResources(
              action as PermissionAction,
            ),
          )
        : [];

      if (mustBeAllResources.length > 0 && value !== -1) {
        if (mustBeAllResources.length === 1) {
          return this.createError({
            message: `A ação ${PermissionAction.translate(
              mustBeAllResources[0] as PermissionAction,
              this.parent.resource as Resource,
            )} exige que "Todos os recursos" seja selecionado`,
          });
        }
        return this.createError({
          message: `As ações ${mustBeAllResources.map((action) => PermissionAction.translate(action as PermissionAction, this.parent.resource as Resource)).join(', ')} exigem que "Todos os recursos" seja selecionado`,
        });
      }

      if (!all_resources && typeof value === 'number' && value < 1) {
        return this.createError({ message: 'Deve ser uma opção válida' });
      }

      return true;
    }),
  resource_name: yup.string().optional(),
  all_resources: yup.boolean().required(),
  role_id: yup
    .number()
    .optional()
    .test('is-positive', 'Deve ser uma opção válida', (value) => {
      if (value === undefined) return true; // Permite que o campo seja opcional
      return value >= 0;
    }),
});

export const defaultValues: IPermissionForm = {
  resource: '' as Resource,
  all_resources: false,
  resource_id: 0,
  resource_ids: [],
  resource_name: '',
  actions: [],
  role_id: undefined,
};
