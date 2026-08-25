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
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useMemo,
} from 'react';
import { Flex } from '@chakra-ui/react';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import useClassrooms from '../../../hooks/classrooms/useClassrooms';
import useCourses from '../../../hooks/courses/useCourses';
import { RoleResponse } from '../../../models/http/responses/role.response.models';
import useBuildings from '../../../hooks/useBuildings';

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
  roles?: RoleResponse[];
  showRoleSelect?: boolean;
  batchMode?: boolean;
  initialValues?: IPermissionForm | null;
}

const PermissionForm = forwardRef<PermisionFormRef, PermissionFormProps>(
  (
    { roles = [], showRoleSelect = false, batchMode = false, initialValues = null },
    ref,
  ) => {
    const formRef = useRef<HTMLDivElement | null>(null);

    const form = useForm<IPermissionForm>({
      defaultValues: defaultValues,
      resolver: yupResolver(schema),
    });

    const { trigger, reset, getValues, clearErrors, control } = form;

    const {
      classrooms,
      getAllClassrooms,
      loading: loadingClassrooms,
    } = useClassrooms(false);
    const { courses, getCourses, loading: loadingCourses } = useCourses(false);
    const {
      buildings,
      getBuildings,
      loading: loadingBuildings,
    } = useBuildings(false);

    const loading = loadingClassrooms || loadingCourses || loadingBuildings;

    const selectedResource = useWatch({ control, name: 'resource' });
    const allResources = useWatch({ control, name: 'all_resources' });

    const handleResourceChange = useCallback(
      async (resource?: Resource) => {
        if (!resource) return;

        if (resource === Resource.CLASSROOM && !classrooms.length) {
          await getAllClassrooms();
          return;
        }

        if (resource === Resource.COURSE && !courses.length) {
          await getCourses();
          return;
        }

        if (resource === Resource.BUILDING && !buildings.length) {
          await getBuildings();
          return;
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    useImperativeHandle(ref, () => ({
      async validate() {
        const valid = await trigger();
        if (showRoleSelect) {
          const values = getValues();
          if (!values.role_id) {
            form.setError('role_id', {
              message: 'Selecione um cargo para esta permissão',
            });
            return null;
          }
        }
        if (batchMode) {
          const values = getValues();
          if (
            !Array.isArray(values.resource_ids) ||
            values.resource_ids.length === 0
          ) {
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
        reset({
          ...defaultValues,
          ...values,
          resource_ids: values.resource_ids ?? [],
        });
        clearErrors();
        await handleResourceChange(values.resource as Resource);
      },
    }));

    const resourceOptions = useMemo<ResourceItemOption[]>(() => {
      if (selectedResource === Resource.CLASSROOM) {
        return classrooms.map((classroom) => ({
          label: `[${classroom.building}]: ${classroom.name}`,
          value: classroom.id,
        }));
      }

      if (selectedResource === Resource.COURSE) {
        return courses.map((course) => ({
          label: `Curso: ${course.name}`,
          value: course.id,
        }));
      }

      if (selectedResource === Resource.BUILDING) {
        return buildings.map((building) => ({
          label: `Prédio: ${building.name}`,
          value: building.id,
        }));
      }

      return [];
    }, [selectedResource, classrooms, courses, buildings]);

    useEffect(() => {
      if (batchMode || !initialValues) return;

      reset({ ...defaultValues, ...initialValues, resource_ids: [] });
      clearErrors();
      void handleResourceChange(initialValues.resource);
    }, [batchMode, clearErrors, handleResourceChange, initialValues, reset]);

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
                  form.setValue(
                    'resource_id',
                    firstValue?.value ? Number(firstValue.value) : 0,
                  );
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
                        tooltip: PermissionAction.describe(
                          value,
                          selectedResource as Resource,
                        ),
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
          {showRoleSelect && (
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
            </Flex>
          )}
        </FormProvider>
      </Flex>
    );
  },
);

export default PermissionForm;
