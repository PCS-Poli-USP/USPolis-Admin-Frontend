import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { defaultValues, schema } from './permission.form.interface';
import { CheckBox, MultiSelectInput, SelectInput } from '../../../components/common';
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

export interface ResourceItemOption {
  label: string;
  value: number;
  tooltip?: string;
}

const PermissionForm = forwardRef((_, ref) => {
  const formRef = useRef<HTMLDivElement | null>(null);

  const form = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  const { trigger, reset, getValues, clearErrors, control } = form;

  const [resourceOptions, setResourceOptions] = useState<ResourceItemOption[]>(
    [],
  );
  const {
    classrooms,
    getAllClassrooms,
    loading: loadingClassrooms,
  } = useClassrooms(false);
  const { courses, getCourses, loading: loadingCourses } = useCourses(false);

  const loading = loadingClassrooms || loadingCourses;

  const selectedResource = useWatch({ control, name: 'resource' });
  const allResources = useWatch({ control, name: 'all_resources' });

  console.log('Selected Resource:', selectedResource);

  useImperativeHandle(ref, () => ({
    async validate() {
      const valid = await trigger();
      if (!valid) return null;
      return getValues();
    },
    reset() {
      reset();
      clearErrors();
    },
    getValues() {
      return getValues();
    },
  }));

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
          <SelectInput
            name='resource'
            label='Recurso'
            placeholder='Selecione um recurso'
            options={resourceOptions}
            isLoading={loading}
            disabled={!selectedResource || allResources}
          />
          <CheckBox name='all_resources' text='Todos os recursos' />
        </Flex>
        <MultiSelectInput
          name='actions'
          label='Ações'
          options={
            selectedResource
              ? PermissionAction.getValues(selectedResource as Resource).map(
                  (value) => ({
                    label: PermissionAction.translate(
                      value,
                      selectedResource as Resource,
                    ),
                    value: value,
                  }),
                )
              : []
          }
          placeholder={
            selectedResource
              ? 'Selecione uma ação'
              : 'Selecione um recurso primeiro'
          }
          disabled={!selectedResource}
        />
      </FormProvider>
    </Flex>
  );
});

export default PermissionForm;
