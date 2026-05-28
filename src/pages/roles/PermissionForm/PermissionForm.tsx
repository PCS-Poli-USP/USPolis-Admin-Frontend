import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import {
  defaultValues,
  IPermissionForm,
  schema,
} from './permission.form.interface';
import {
  CheckBox,
  MultiSelectInput,
  SelectInput,
} from '../../../components/common';
import { Resource } from '../../../utils/enums/resources.enums';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Flex } from '@chakra-ui/react';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import useClassrooms from '../../../hooks/classrooms/useClassrooms';
import useCourses from '../../../hooks/courses/useCourses';
import { UserCoreResponse } from '../../../models/http/responses/user.response.models';
import { RoleResponse } from '../../../models/http/responses/role.response.models';

export const ALL_RESOURCES_VALUE = -1;
export interface ResourceItemOption {
  label: string;
  value: number;
  tooltip?: string;
}

export interface PermisionFormRef {
  validate: () => Promise<IPermissionForm | null>;
  reset: () => void;
  getValues: () => IPermissionForm;
  setValues: (values: IPermissionForm) => Promise<void>;
}

interface PermissionFormProps {
  users?: UserCoreResponse[];
  roles?: RoleResponse[];
  showUserRoleSelects?: boolean;
  batchMode?: boolean;
}

const PermissionForm = forwardRef<PermisionFormRef, PermissionFormProps>(
  (
    { users = [], roles = [], showUserRoleSelects = false, batchMode = false },
    ref,
  ) => {
    const formRef = useRef<HTMLDivElement | null>(null);

    const form = useForm<IPermissionForm>({
      defaultValues: defaultValues,
      resolver: yupResolver(schema),
    });

    const { trigger, reset, getValues, clearErrors, control } = form;

    const [resourceOptions, setResourceOptions] = useState<
      ResourceItemOption[]
    >([]);
    const {
      classrooms,
      getAllClassrooms,
      loading: loadingClassrooms,
    } = useClassrooms(false);
    const { courses, getCourses, loading: loadingCourses } = useCourses(false);

    const loading = loadingClassrooms || loadingCourses;

    const selectedResource = useWatch({ control, name: 'resource' });
    const allResources = useWatch({ control, name: 'all_resources' });

    async function handleResourceChange(resource?: Resource) {
      if (!resource) return;

      if (resource === Resource.CLASSROOM) {
        await getAllClassrooms();
        return;
      }

      if (resource === Resource.COURSE) {
        await getCourses();
      }
    }

    useImperativeHandle(ref, () => ({
      async validate() {
        const valid = await trigger();
        if (showUserRoleSelects) {
          const values = getValues();
          if (!values.user_id && !values.role_id) {
            form.setError('user_id', {
              message: 'Selecione um usuário e/ou um cargo para esta permissão',
            });
            form.setError('role_id', {
              message: 'Selecione um usuário e/ou um cargo para esta permissão',
            });
            return null;
          }
        }
        if (batchMode) {
          const values = getValues();
          if (!Array.isArray(values.resource_ids) || values.resource_ids.length === 0) {
            form.setError('resource_ids', {
              message: 'Selecione pelo menos um recurso',
            });
            return null;
          }
        }
        if (!valid) return null;
        return getValues();
      },
      reset() {
        reset(defaultValues);
        clearErrors();
      },
      getValues() {
        return getValues();
      },
      async setValues(values: IPermissionForm) {
        reset({ ...defaultValues, ...values, resource_ids: values.resource_ids ?? [] });
        clearErrors();
        await handleResourceChange(values.resource as Resource);
      },
    }));

    useEffect(() => {
      if (selectedResource === Resource.CLASSROOM) {
        const options = classrooms.map((classroom) => ({
          label: `[${classroom.building}]: ${classroom.name}`,
          value: classroom.id,
        }));

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setResourceOptions(options);
      } else if (selectedResource === Resource.COURSE) {
        const options = courses.map((course) => ({
          label: `Curso: ${course.name}`,
          value: course.id,
        }));
        setResourceOptions(options);
      } else {
        setResourceOptions([]);
      }
    }, [selectedResource, allResources, classrooms, courses]);

    const resourceSelectOptions = resourceOptions.map((option) => ({
      ...option,
    }));

    return (
      <Flex ref={formRef} w={'full'} direction={'column'} gap={'10px'}>
        <FormProvider {...form}>
          <Flex w={'full'} direction={'column'} gap={'10px'}>
            <SelectInput
              name='resource'
              label='Tipo de Recurso'
              placeholder='Selecione um recurso'
              options={Resource.getValues().map((value) => ({
                label: Resource.translate(value),
                value: value,
              }))}
              onChange={(option) =>
                handleResourceChange(option?.value as Resource | undefined)
              }
            />
            {!batchMode ? (
              <SelectInput
                name='resource_id'
                label='Recurso'
                placeholder='Selecione um recurso'
                options={resourceSelectOptions}
                isLoading={loading}
                disabled={!selectedResource || allResources}
                onChange={(value) => {
                  if (value) {
                    form.setValue('resource_name', value.label);
                  }
                }}
              />
            ) : (
              <MultiSelectInput
                name='resource_ids'
                label='Recursos'
                placeholder='Selecione um ou mais recursos'
                options={resourceSelectOptions}
                isLoading={loading}
                disabled={!selectedResource || allResources}
                onChange={(values) => {
                  const firstValue = values[0];
                  form.setValue('resource_id', firstValue?.value ? Number(firstValue.value) : 0);
                  form.setValue('resource_name', firstValue?.label ?? '');
                }}
              />
            )}
            <CheckBox
              name='all_resources'
              text='Todos os recursos'
              disabled={!selectedResource || batchMode}
              onChange={(value) => {
                if (value) {
                  reset({
                    ...getValues(),
                    resource_id: ALL_RESOURCES_VALUE,
                    resource_ids: [],
                  });
                  const oldActions = getValues().actions;
                  const validActions = selectedResource
                    ? PermissionAction.getValues(
                        selectedResource as Resource,
                      ).filter((action) =>
                        PermissionAction.canHaveAllResources(
                          action as PermissionAction,
                          selectedResource as Resource,
                        ),
                      )
                    : [];
                  const newActions = oldActions.filter((action) =>
                    validActions.includes(action),
                  );
                  form.setValue('actions', newActions);
                }
              }}
            />
            <MultiSelectInput
              name='actions'
              label='Ações'
              options={
                selectedResource
                  ? PermissionAction.getValues(selectedResource as Resource)
                      .filter(
                        (action) =>
                          !allResources ||
                          PermissionAction.canHaveAllResources(
                            action as PermissionAction,
                            selectedResource as Resource,
                          ),
                      )
                      .map((value) => ({
                        label: PermissionAction.translate(
                          value,
                          selectedResource as Resource,
                        ),
                        value: value,
                      }))
                  : []
              }
              placeholder={
                selectedResource
                  ? 'Selecione uma ação'
                  : 'Selecione um recurso primeiro'
              }
              disabled={!selectedResource}
            />
          </Flex>
          {showUserRoleSelects && (
            <Flex w={'full'} direction={'column'} gap={'10px'}>
              <SelectInput
                name='role_id'
                label='Cargo'
                placeholder='Selecione um cargo para esta permissão'
                options={roles.map((role) => ({
                  label: role.name,
                  value: role.id,
                }))}
              />
              <SelectInput
                name='user_id'
                label='Usuário'
                placeholder='Selecione um usuário para esta permissão'
                options={users.map((user) => ({
                  label: `${user.name} (${user.email})`,
                  value: user.id,
                }))}
              />
            </Flex>
          )}
        </FormProvider>
      </Flex>
    );
  },
);

export default PermissionForm;
