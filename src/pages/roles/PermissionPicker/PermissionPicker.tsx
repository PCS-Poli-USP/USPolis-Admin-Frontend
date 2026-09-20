import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { InfoOutlineIcon, SearchIcon } from '@chakra-ui/icons';
import type { ReactNode } from 'react';
import { useImperativeHandle, useMemo, useState, forwardRef } from 'react';
import { ClassroomResponse } from '../../../models/http/responses/classroom.response.models';
import { CourseResponse } from '../../../models/http/responses/course.response.models';
import { BuildingResponse } from '../../../models/http/responses/building.response.models';
import { Resource } from '../../../utils/enums/resources.enums';
import { PermissionAction } from '../../../utils/enums/actions.enums';
import TooltipSelect from '../../../components/common/TooltipSelect';

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Text
      fontSize={'11px'}
      fontWeight={'bold'}
      letterSpacing={'0.05em'}
      textTransform={'uppercase'}
      color={'uspolis.textMuted'}
      mb={'4px'}
    >
      {children}
    </Text>
  );
}

export interface PermissionPickerPayload {
  resource: Resource;
  actions: PermissionAction[];
  resource_id?: number;
  resource_name?: string;
}

export interface PermissionPickerRef {
  confirm: () => PermissionPickerPayload[] | null;
  reset: () => void;
}

interface PermissionPickerProps {
  classrooms: ClassroomResponse[];
  courses: CourseResponse[];
  buildings: BuildingResponse[];
  existingPermissions: { resource: Resource; resource_id?: number }[];
}

const RES_TYPE_OPTIONS: { value: Resource; label: string }[] = [
  { value: Resource.CLASSROOM, label: 'Sala' },
  { value: Resource.BUILDING, label: 'Prédio' },
  { value: Resource.COURSE, label: 'Curso' },
];

const selectMenuProps = {
  menuPortalTarget: document.body,
  styles: {
    menuPortal: (base: Record<string, unknown>) => ({ ...base, zIndex: 1500 }),
  },
};

const PermissionPicker = forwardRef<PermissionPickerRef, PermissionPickerProps>(
  ({ classrooms, courses, buildings, existingPermissions }, ref) => {
    const [resType, setResType] = useState<Resource | ''>('');
    const [resId, setResId] = useState('');
    const [classroomIds, setClassroomIds] = useState<number[]>([]);
    const [buildingFilter, setBuildingFilter] = useState('');
    const [classroomSearch, setClassroomSearch] = useState('');
    const [actions, setActions] = useState<PermissionAction[]>([]);
    const [allResources, setAllResources] = useState(false);

    const isClassroomType = resType === Resource.CLASSROOM;
    const isSingleResType =
      resType === Resource.BUILDING || resType === Resource.COURSE;

    const existingIdsOfType = useMemo(() => {
      if (!resType) return new Set<number>();
      return new Set(
        existingPermissions
          .filter((permission) => permission.resource === resType)
          .map((permission) => permission.resource_id),
      );
    }, [existingPermissions, resType]);

    const resOptions = useMemo(() => {
      if (resType === Resource.BUILDING) {
        return buildings
          .filter((building) => !existingIdsOfType.has(building.id))
          .map((building) => ({ value: building.id, label: building.name }));
      }
      if (resType === Resource.COURSE) {
        return courses
          .filter((course) => !existingIdsOfType.has(course.id))
          .map((course) => ({ value: course.id, label: course.name }));
      }
      return [];
    }, [resType, buildings, courses, existingIdsOfType]);

    const classroomOptions = useMemo(() => {
      return classrooms
        .filter((classroom) => !existingIdsOfType.has(classroom.id))
        .filter(
          (classroom) =>
            !buildingFilter || String(classroom.building_id) === buildingFilter,
        )
        .map((classroom) => ({
          id: classroom.id,
          label: `${classroom.name} · ${classroom.building}`,
        }));
    }, [classrooms, existingIdsOfType, buildingFilter]);

    const visibleClassroomOptions = useMemo(() => {
      const query = classroomSearch.trim().toLowerCase();
      if (!query) return classroomOptions;
      return classroomOptions.filter((option) =>
        option.label.toLowerCase().includes(query),
      );
    }, [classroomOptions, classroomSearch]);

    const buildingFilterOptions = useMemo(
      () =>
        Array.from(
          new Map(classrooms.map((c) => [c.building_id, c.building])).entries(),
        ).map(([id, label]) => ({ value: id, label })),
      [classrooms],
    );

    const availableActions = useMemo(() => {
      if (!resType) return [];
      return PermissionAction.getValues(resType).filter(
        (action) =>
          !allResources ||
          PermissionAction.canHaveAllResources(action, resType),
      );
    }, [resType, allResources]);

    const hasSelection = isClassroomType
      ? allResources || classroomIds.length > 0
      : allResources || !!resId;

    function reset() {
      setResType('');
      setResId('');
      setClassroomIds([]);
      setBuildingFilter('');
      setClassroomSearch('');
      setActions([]);
      setAllResources(false);
    }

    function handleSelectResType(value: string) {
      setResType(value as Resource | '');
      setResId('');
      setClassroomIds([]);
      setBuildingFilter('');
      setClassroomSearch('');
      setActions([]);
      setAllResources(false);
    }

    function toggleClassroom(id: number) {
      setClassroomIds((prev) =>
        prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id],
      );
    }

    function toggleAction(action: PermissionAction) {
      setActions((prev) =>
        prev.includes(action)
          ? prev.filter((a) => a !== action)
          : [...prev, action],
      );
    }

    function toggleAllResources() {
      if (!resType) return;
      const next = !allResources;
      setAllResources(next);
      setResId('');
      setClassroomIds([]);
      if (next) {
        setActions((prev) =>
          prev.filter((action) =>
            PermissionAction.canHaveAllResources(action, resType),
          ),
        );
      }
    }

    useImperativeHandle(ref, () => ({
      reset,
      confirm() {
        if (!resType || actions.length === 0 || !hasSelection) return null;

        if (isClassroomType && !allResources) {
          if (classroomIds.length === 0) return null;
          return classroomIds.map((id) => {
            const option = classroomOptions.find((o) => o.id === id);
            return {
              resource: resType,
              actions,
              resource_id: id,
              resource_name: option?.label,
            };
          });
        }

        return [
          {
            resource: resType,
            actions,
            resource_id: allResources ? -1 : Number(resId),
            resource_name: allResources
              ? `Todos: ${Resource.translate(resType)}`
              : resOptions.find((o) => o.value === Number(resId))?.label,
          },
        ];
      },
    }));

    return (
      <Flex direction={'column'} flex={1}>
        <Flex align={'flex-start'} gap={'10px'} wrap={'wrap'} flexShrink={0}>
          <Box w={'fit-content'}>
            <FieldLabel>Tipo de recurso</FieldLabel>
            <TooltipSelect
              {...selectMenuProps}
              isClearable
              placeholder={'Tipo de recurso...'}
              value={
                resType
                  ? RES_TYPE_OPTIONS.find((o) => o.value === resType)
                  : null
              }
              options={RES_TYPE_OPTIONS}
              onChange={(option) =>
                handleSelectResType(option ? String(option.value) : '')
              }
            />
          </Box>

          {isSingleResType && (
            <Box w={'220px'}>
              <FieldLabel>Recurso</FieldLabel>
              <TooltipSelect
                {...selectMenuProps}
                isClearable
                isDisabled={allResources}
                placeholder={'Selecionar recurso...'}
                value={
                  resId
                    ? resOptions.find((o) => o.value === Number(resId))
                    : null
                }
                options={resOptions}
                onChange={(option) =>
                  setResId(option ? String(option.value) : '')
                }
              />
            </Box>
          )}

          {isClassroomType && (
            <Box w={'200px'}>
              <FieldLabel>Filtrar por prédio</FieldLabel>
              <TooltipSelect
                {...selectMenuProps}
                isClearable
                isDisabled={allResources}
                placeholder={'Todos os prédios'}
                value={
                  buildingFilter
                    ? buildingFilterOptions.find(
                        (o) => o.value === Number(buildingFilter),
                      )
                    : null
                }
                options={buildingFilterOptions}
                onChange={(option) =>
                  setBuildingFilter(option ? String(option.value) : '')
                }
              />
            </Box>
          )}

          {resType && (
            <Box pt={'22px'} alignSelf={'center'}>
              <Checkbox
                size={'lg'}
                isChecked={allResources}
                onChange={toggleAllResources}
              >
                Todos os recursos
              </Checkbox>
            </Box>
          )}
        </Flex>

        {resType && hasSelection && (
          <Flex direction={'column'} gap={'6px'} mt={'10px'} flexShrink={0}>
            <FieldLabel>Ações permitidas</FieldLabel>
            <Flex gap={'6px'} wrap={'wrap'}>
              {availableActions.map((action) => {
                const selected = actions.includes(action);
                return (
                  <Tooltip
                    key={action}
                    label={PermissionAction.describe(action, resType)}
                    isDisabled={!PermissionAction.describe(action, resType)}
                  >
                    <Button
                      size={'xs'}
                      borderRadius={'full'}
                      variant={selected ? 'solid' : 'outline'}
                      colorScheme={'blue'}
                      onClick={() => toggleAction(action)}
                    >
                      {PermissionAction.translate(action, resType)}
                    </Button>
                  </Tooltip>
                );
              })}
            </Flex>
          </Flex>
        )}

        {isClassroomType && !allResources && (
          <Box
            mt={'10px'}
            flex={1}
            minH={0}
            display={'flex'}
            flexDirection={'column'}
          >
            <FieldLabel>{`Salas (${visibleClassroomOptions.length})`}</FieldLabel>
            {classroomOptions.length > 8 && (
              <InputGroup size={'sm'} mb={'8px'} flexShrink={0}>
                <InputLeftElement pointerEvents={'none'}>
                  <SearchIcon color={'uspolis.textMuted'} boxSize={'12px'} />
                </InputLeftElement>
                <Input
                  placeholder={'Buscar sala...'}
                  value={classroomSearch}
                  onChange={(e) => setClassroomSearch(e.target.value)}
                />
              </InputGroup>
            )}
            <Flex
              flex={1}
              wrap={'wrap'}
              alignContent={'flex-start'}
              gap={'6px'}
              minH={'130px'}
              overflow={'auto'}
            >
              {visibleClassroomOptions.map((option) => {
                const selected = classroomIds.includes(option.id);
                return (
                  <Button
                    key={option.id}
                    size={'xs'}
                    borderRadius={'full'}
                    variant={selected ? 'solid' : 'outline'}
                    colorScheme={'blue'}
                    onClick={() => toggleClassroom(option.id)}
                  >
                    {option.label}
                  </Button>
                );
              })}
              {classroomOptions.length === 0 && (
                <Text fontSize={'12.5px'} color={'uspolis.gray'}>
                  Nenhuma sala disponível.
                </Text>
              )}
              {classroomOptions.length > 0 &&
                visibleClassroomOptions.length === 0 && (
                  <Text fontSize={'12.5px'} color={'uspolis.gray'}>
                    Nenhuma sala encontrada para {`"${classroomSearch}"`}.
                  </Text>
                )}
            </Flex>
          </Box>
        )}

        {!resType && (
          <Flex
            flex={1}
            direction={'column'}
            align={'center'}
            justify={'center'}
            gap={'8px'}
            mt={'18px'}
            minH={'200px'}
            border={'1px dashed'}
            borderColor={'uspolis.border'}
            borderRadius={'10px'}
            textAlign={'center'}
          >
            <InfoOutlineIcon boxSize={'22px'} color={'uspolis.textMuted'} />
            <Text fontSize={'14px'} fontWeight={'bold'} color={'uspolis.black'}>
              Nenhum recurso selecionado
            </Text>
            <Text fontSize={'13px'} color={'uspolis.textMuted'} maxW={'320px'}>
              Escolha um tipo de recurso acima para configurar quais ações esta
              permissão concede.
            </Text>
          </Flex>
        )}
      </Flex>
    );
  },
);

PermissionPicker.displayName = 'PermissionPicker';

export default PermissionPicker;
