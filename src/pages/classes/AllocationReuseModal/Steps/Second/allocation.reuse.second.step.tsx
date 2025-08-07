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
import { useState } from 'react';
import { AllocationReuseResponse } from '../../../../../models/http/responses/allocation.response.models';
import useAllocationsService from '../../../../../hooks/API/services/useAllocationService';
import { SubjectWithClasses } from '../../allocation.reuse.modal';
import AllocationReuseSubjectOptions from './allocation.reuse.subject.options';

interface AllocationReuseModalSecondStepProps {
  buildings: BuildingResponse[];
  map: Map<number, SubjectWithClasses>;
  allocationMap: Map<number, number[]>;
  setAllocationMap: (map: Map<number, number[]>) => void;
}

function AllocationReuseModalSecondStep({
  buildings,
  map,
  allocationMap,
  setAllocationMap,
}: AllocationReuseModalSecondStepProps) {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let i = 2024; i < currentYear; i++) {
    years.push(i);
  }

  const { getAllocationOptions } = useAllocationsService();

  const [allocationYear, setAllocationYear] = useState<number>(currentYear - 1);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingResponse>();
  const [data, setData] = useState<AllocationReuseResponse>();
  const [loading, setLoading] = useState<boolean>(false);

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
              if (building) {
                setLoading(true);
                const targets = Array.from(map.values()).map((subject) => ({
                  subject_id: subject.subject_id,
                  class_ids: subject.class_ids,
                }));

                setSelectedBuilding(building);
                await getAllocationOptions({
                  building_id: building.id,
                  allocation_year: allocationYear,
                  targets: targets,
                  strict: true,
                })
                  .then((res) => {
                    setData(res.data);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }
            }
            if (!option) {
              setSelectedBuilding(undefined);
              setData(undefined);
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
      <Skeleton isLoaded={!loading} w={'100%'} h={'100%'} minH={'200px'}>
        {data &&
          data.target_options &&
          data.target_options.map((target) => (
            <AllocationReuseSubjectOptions
              data={target}
              allocationMap={allocationMap}
              setAllocationMap={setAllocationMap}
            />
          ))}
      </Skeleton>
    </Flex>
  );
}

export default AllocationReuseModalSecondStep;
