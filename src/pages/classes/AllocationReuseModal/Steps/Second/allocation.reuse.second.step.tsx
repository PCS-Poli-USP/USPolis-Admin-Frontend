import { Button, Flex, Heading, Text } from '@chakra-ui/react';
import Select from 'react-select';
import { BuildingResponse } from '../../../../../models/http/responses/building.response.models';
import { useState } from 'react';
import { AllocationReuseResponse } from '../../../../../models/http/responses/allocation.response.models';
import useAllocationsService from '../../../../../hooks/API/services/useAllocationService';
import { SubjectWithClasses } from '../../allocation.reuse.modal';

interface AllocationReuseModalSecondStepProps {
  buildings: BuildingResponse[];
  map: Map<number, SubjectWithClasses>;
}

function AllocationReuseModalSecondStep({
  buildings,
  map,
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

  console.log(data);

  return (
    <Flex direction={'column'} gap={'10px'} w={'100%'}>
      <div hidden={buildings.length === 0}>
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
          onChange={(option) => {
            setSelectedBuilding(
              option ? buildings.find((b) => b.id === option.value) : undefined,
            );
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
      <Button
        onClick={async () => {
          if (selectedBuilding) {
            const targets = Array.from(map.values()).map((subject) => ({
              subject_id: subject.subject_id,
              class_ids: subject.class_ids,
            }));
            const response = await getAllocationOptions({
              building_id: selectedBuilding.id,
              allocation_year: allocationYear,
              targets: targets,
              strict: true,
            });
            setData(response.data);
          }
        }}
      >
        Send
      </Button>
    </Flex>
  );
}

export default AllocationReuseModalSecondStep;
