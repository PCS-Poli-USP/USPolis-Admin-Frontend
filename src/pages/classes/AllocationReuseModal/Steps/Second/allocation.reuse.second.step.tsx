import {
  Alert,
  AlertIcon,
  Flex,
  Heading,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { BuildingResponse } from '../../../../../models/http/responses/building.response.models';
import { useEffect, useState } from 'react';
import { AllocationReuseResponse } from '../../../../../models/http/responses/allocation.response.models';
import {
  ScheduleAllocationData,
  SubjectWithClasses,
} from '../../allocation.reuse.modal';
import AllocationReuseSubjectOptions from './allocation.reuse.subject.options';
import TooltipSelect from '../../../../../components/common/TooltipSelect';
import { AllocationReuseInput } from '../../../../../models/http/requests/allocation.request.models';
import { AxiosResponse } from 'axios';

interface AllocationReuseModalSecondStepProps {
  buildings: BuildingResponse[];
  map: Map<number, SubjectWithClasses>;
  allocationMap: Map<number, ScheduleAllocationData>;
  setAllocationMap: (map: Map<number, ScheduleAllocationData>) => void;
  getAllocationOptions: (
    data: AllocationReuseInput,
  ) => Promise<AxiosResponse<AllocationReuseResponse>>;
  allocationReuseResponse: AllocationReuseResponse | undefined;
  setAllocationReuseResponse: (
    val: AllocationReuseResponse | undefined,
  ) => void;
  selectedBuilding: BuildingResponse | undefined;
  setSelectedBuilding: (value: BuildingResponse | undefined) => void;
  mustRefetch: boolean;
  setMustRefetch: (value: boolean) => void;
  isValid: boolean;
}

function AllocationReuseModalSecondStep({
  buildings,
  map,
  allocationMap,
  setAllocationMap,
  getAllocationOptions,
  allocationReuseResponse,
  setAllocationReuseResponse,
  selectedBuilding,
  setSelectedBuilding,
  mustRefetch,
  setMustRefetch,
  isValid,
}: AllocationReuseModalSecondStepProps) {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = 2024; i <= currentYear; i++) {
    years.push(i);
  }

  const validSchedules = Array.from(allocationMap.values()).filter(
    (val) => val.classroom_ids.length > 0,
  );
  const [allocationYear, setAllocationYear] = useState<number>(currentYear);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleBuildingChange() {
    if (selectedBuilding && mustRefetch) {
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
    if (allocationReuseResponse && mustRefetch) {
      const newMap = new Map(allocationMap);
      const subjectOptions = allocationReuseResponse.target_options;
      subjectOptions.forEach((subject) => {
        const classOptions = subject.class_options;
        classOptions.forEach((option) => {
          option.schedule_options.forEach((scheduleOption) => {
            const options = scheduleOption.options.filter(
              (opt) => opt.classroom && opt.classroom_id,
            );
            newMap.set(
              scheduleOption.schedule_target_id,
              options.length === 1
                ? {
                    classroom_ids: options.map(
                      (opt) => opt.classroom_id as number,
                    ),
                    classrooms: options.map((opt) => opt.classroom) as string[],
                  }
                : {
                    classroom_ids: [],
                    classrooms: [],
                  },
            );
          });
        });
      });
      setAllocationMap(newMap);
      setMustRefetch(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allocationReuseResponse, mustRefetch]);

  return (
    <Flex direction={'column'} gap={'10px'} w={'100%'}>
      <div hidden={buildings.length === 1}>
        <Text fontWeight={'bold'}>Prédio: </Text>
        <TooltipSelect
          placeholder={'Selecione um prédio para buscar uma alocação'}
          isMulti={false}
          value={
            selectedBuilding
              ? { label: selectedBuilding.name, value: selectedBuilding.id }
              : undefined
          }
          hasError={!isValid && !selectedBuilding}
          options={buildings.map((building) => ({
            label: building.name,
            value: building.id,
          }))}
          onChange={async (option) => {
            if (option) {
              const building = buildings.find((b) => b.id === option.value);
              if (building && building.id != selectedBuilding?.id) {
                setMustRefetch(true);
                setSelectedBuilding(building);
              }
            }
            if (!option) {
              setSelectedBuilding(undefined);
              setAllocationReuseResponse(undefined);
            }
          }}
        />
      </div>
      <Text fontWeight={'bold'}>Ano da alocação a ser reaproveitada: </Text>
      <TooltipSelect
        placeholder={'Selecione um ano de alocação'}
        isMulti={false}
        isClearable={false}
        value={{ label: String(allocationYear), value: allocationYear }}
        options={years.map((year) => ({
          label: String(year),
          value: year,
        }))}
        onChange={(option) => {
          setAllocationYear(
            option ? (option.value as number) : currentYear - 1,
          );
        }}
      />
      <Heading size={'md'}>
        Alocações encontradas para as turmas <b>atuais</b>:
      </Heading>
      {!selectedBuilding && (
        <Alert status='error'>
          <AlertIcon />
          Selecione um prédio para buscar alocações.
        </Alert>
      )}

      {!isValid && validSchedules.length == 0 && (
        <Alert status='error'>
          <AlertIcon />
          Selecione pelo menos uma sala para pelo menos uma agenda
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
          !allocationReuseResponse.target_options.length) &&
          isValid &&
          selectedBuilding && (
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
