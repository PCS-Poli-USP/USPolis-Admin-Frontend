import {
  Alert,
  AlertIcon,
  Flex,
  Heading,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import Select from 'react-select';
import { BuildingResponse } from '../../../../../models/http/responses/building.response.models';
import { useEffect, useState } from 'react';
import { AllocationReuseResponse } from '../../../../../models/http/responses/allocation.response.models';
import useAllocationsService from '../../../../../hooks/API/services/useAllocationService';
import {
  ScheduleAllocationData,
  SubjectWithClasses,
} from '../../allocation.reuse.modal';
import AllocationReuseSubjectOptions from './allocation.reuse.subject.options';

interface AllocationReuseModalSecondStepProps {
  buildings: BuildingResponse[];
  map: Map<number, SubjectWithClasses>;
  allocationMap: Map<number, ScheduleAllocationData>;
  setAllocationMap: (map: Map<number, ScheduleAllocationData>) => void;
  selectedBuilding: BuildingResponse | undefined;
  setSelectedBuilding: (building: BuildingResponse | undefined) => void;
  allocationReuseResponse: AllocationReuseResponse | undefined;
  setAllocationReuseResponse: (
    response: AllocationReuseResponse | undefined,
  ) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

function AllocationReuseModalSecondStep({
  buildings,
  map,
  allocationMap,
  setAllocationMap,
  selectedBuilding,
  setSelectedBuilding,
  allocationReuseResponse,
  setAllocationReuseResponse,
  loading,
  setLoading,
}: AllocationReuseModalSecondStepProps) {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = 2024; i < currentYear; i++) {
    years.push(i);
  }

  const { getAllocationOptions } = useAllocationsService();

  const [allocationYear, setAllocationYear] = useState<number>(currentYear - 1);

  async function handleBuildingChange() {
    if (selectedBuilding) {
      setLoading(true);
      const targets = Array.from(map.values()).map((subject) => ({
        subject_id: subject.subject_id,
        class_ids: subject.class_ids,
      }));

      await getAllocationOptions({
        building_id: selectedBuilding.id,
        allocation_year: allocationYear,
        targets: targets,
        strict: true,
      })
        .then((res) => {
          setAllocationReuseResponse(res.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }
  useEffect(() => {
    if (selectedBuilding) {
      handleBuildingChange();
    } else {
      setAllocationReuseResponse(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBuilding]);

  useEffect(() => {
    if (allocationReuseResponse) {
      const newMap = new Map(allocationMap);
      const subjectOptions = allocationReuseResponse.target_options;
      subjectOptions.forEach((subject) => {
        const classOptions = subject.class_options;
        classOptions.forEach((option) => {
          option.schedule_options.forEach((scheduleOption) => {
            const options = scheduleOption.options.filter(
              (opt) => opt.classroom && opt.classroom_id,
            );
            newMap.set(scheduleOption.schedule_target_id, {
              classroom_ids: options.map((opt) => opt.classroom_id as number),
              classrooms: options.map((opt) => opt.classroom) as string[],
            });
          });
        });
      });
      setAllocationMap(newMap);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allocationReuseResponse]);

  return (
    <Flex direction={'column'} gap={'10px'} w={'100%'}>
      <div hidden={buildings.length === 1}>
        <Text fontWeight={'bold'}>Prédio: </Text>
        <Select
          placeholder={'Selecione um prédio para buscar uma alocação'}
          isMulti={false}
          value={
            selectedBuilding
              ? { label: selectedBuilding.name, value: selectedBuilding.id }
              : undefined
          }
          options={buildings.map((building) => ({
            label: building.name,
            value: building.id,
          }))}
          onChange={async (option) => {
            if (option) {
              const building = buildings.find((b) => b.id === option.value);
              setSelectedBuilding(building);
            }
            if (!option) {
              setSelectedBuilding(undefined);
              setAllocationReuseResponse(undefined);
            }
          }}
        />
      </div>
      <Text fontWeight={'bold'}>Ano da alocação anterior: </Text>
      <Select
        placeholder={'Selecione um ano de alocação'}
        isMulti={false}
        isClearable={false}
        value={{ label: String(allocationYear), value: allocationYear }}
        options={years.map((year) => ({
          label: String(year),
          value: year,
        }))}
        onChange={(option) => {
          setAllocationYear(option ? option.value : currentYear - 1);
        }}
      />
      <Heading size={'md'}>Alocações encontradas:</Heading>
      {!selectedBuilding && (
        <Alert status='warning'>
          <AlertIcon />
          Selecione um prédio para buscar alocações.
        </Alert>
      )}
      <Skeleton
        isLoaded={!loading}
        w={'100%'}
        h={'100%'}
        minH={'200px'}
        maxH={'400px'}
        overflowY={'auto'}
      >
        {allocationReuseResponse &&
          allocationReuseResponse.target_options.length > 0 &&
          allocationReuseResponse.target_options.map((target) => (
            <div key={target.subject_id}>
              <AllocationReuseSubjectOptions
                data={target}
                allocationMap={allocationMap}
                setAllocationMap={setAllocationMap}
              />
            </div>
          ))}
        {(!allocationReuseResponse ||
          !allocationReuseResponse.target_options.length) && (
          <Flex direction={'column'} alignItems={'center'} mt={'10px'}>
            <Text fontWeight={'bold'} fontSize={'xl'}>
              Nenhuma alocação encontrada.
            </Text>
            <Text fontSize={'md'}>
              Verifique as turmas selecionadas ou o ano da alocação buscada.
            </Text>
          </Flex>
        )}
      </Skeleton>
    </Flex>
  );
}

export default AllocationReuseModalSecondStep;
