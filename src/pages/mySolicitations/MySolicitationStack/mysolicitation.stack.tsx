import { Box, Checkbox, HStack, StackDivider, VStack } from '@chakra-ui/react';
import Select, { SelectInstance } from 'react-select';
import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import { useEffect, useRef, useState } from 'react';
import SolicitationStackBody from './mysolicitation.stack.body';
import { SolicitationStatus } from '../../../utils/enums/solicitationStatus.enum';

interface SolicitationStackProps {
  solicitations: SolicitationResponse[];
  handleOnClick: (data: SolicitationResponse) => void;
  reset: () => void;
}

type Option = {
  value: string;
  label: string;
};

function SolicitationStack({
  solicitations,
  handleOnClick,
  reset,
}: SolicitationStackProps) {
  const [hidden, setHidden] = useState(true);
  const [current, setCurrent] = useState<SolicitationResponse[]>([]);
  const [filtered, setFiltered] = useState<SolicitationResponse[]>([]);
  const [buildingSearch, setBuildingSearch] = useState('');
  const [classroomSearch, setClassroomSearch] = useState<string>();
  const [classroomOptions, setClassroomOptions] = useState<Option[]>([]);
  const selectRef = useRef<SelectInstance<Option>>(null);

  function filterSolicitation(building: string, classroom: string | undefined) {
    let newCurrent = [...current];
    if (building)
      newCurrent = newCurrent.filter((val) =>
        val.building.toLowerCase().includes(building.toLowerCase()),
      );
    if (classroom)
      newCurrent = newCurrent.filter((val) =>
        val.classroom
          ? val.classroom.toLowerCase().includes(classroom.toLowerCase())
          : 'não especificada'.includes(classroom.toLowerCase()),
      );

    setFiltered(newCurrent);
  }

  useEffect(() => {
    if (hidden) {
      const initial = [
        ...solicitations.filter(
          (solicitation) => solicitation.status === SolicitationStatus.PENDING,
        ),
      ];
      setCurrent(initial);
      setFiltered((prev) =>
        prev.filter((val) => val.status === SolicitationStatus.PENDING),
      );
    } else {
      setCurrent([...solicitations]);
      setFiltered((prev) => {
        return prev;
      });
    }
  }, [hidden, solicitations]);

  const buildingOptions = solicitations
    .map((solicitation) => ({
      value: solicitation.building,
      label: solicitation.building,
    }))
    .filter(
      (value, index, self) =>
        self.findIndex((v) => v.value === value.value) === index,
    )
    .sort((a, b) => a.value.localeCompare(b.value));

  useEffect(() => {
    const options = solicitations
      .filter((val) => val.building === buildingSearch)
      .map((solicitation) => ({
        value: solicitation.classroom
          ? solicitation.classroom
          : 'Não especificada',
        label: solicitation.classroom
          ? solicitation.classroom
          : 'Não especificada',
      }))
      .filter(
        (value, index, self) =>
          self.findIndex((v) => v.value === value.value) === index,
      )
      .sort((a, b) => a.value.localeCompare(b.value));
    setClassroomOptions(options);
  }, [buildingSearch, solicitations]);

  return (
    <VStack
      divider={<StackDivider border={'1px solid lightgray'} />}
      alignItems={'flex-start'}
      alignContent={'flex-start'}
      w={'full'}
      spacing={2}
      paddingRight={5}
    >
      <HStack w={'full'}>
        <Box w={'50%'}>
          <Select
            placeholder='Filtrar por Prédio'
            value={
              buildingSearch
                ? { label: buildingSearch, value: buildingSearch }
                : undefined
            }
            isClearable={true}
            isSearchable={true}
            options={buildingOptions}
            onChange={(option: Option | null) => {
              if (option) {
                setBuildingSearch(option.value);
                if (selectRef.current) selectRef.current.clearValue();
                setClassroomSearch(undefined);
                filterSolicitation(option.value, undefined);
              } else {
                setBuildingSearch('');
                setClassroomSearch(undefined);
                if (selectRef.current) selectRef.current.clearValue();
              }
            }}
          />
        </Box>
        <Box w={'50%'}>
          <Select
            ref={selectRef}
            placeholder='Filtrar por Sala'
            value={
              classroomSearch
                ? { label: classroomSearch, value: classroomSearch }
                : undefined
            }
            isClearable={true}
            isSearchable={true}
            isDisabled={buildingSearch === ''}
            options={classroomOptions}
            onChange={(option: Option | null) => {
              if (option) {
                setClassroomSearch(option.value);
                filterSolicitation(buildingSearch, option.value);
              } else {
                setClassroomSearch(undefined);
                filterSolicitation(buildingSearch, undefined);
              }
            }}
          />
        </Box>
      </HStack>
      <HStack>
        <Checkbox
          isChecked={hidden}
          onChange={() => {
            setHidden((prev) => !prev);
          }}
        >
          Ocultar aprovados/negados
        </Checkbox>
      </HStack>
      <SolicitationStackBody
        reset={reset}
        solicitations={buildingSearch || classroomSearch ? filtered : current}
        handleOnClick={handleOnClick}
      />
    </VStack>
  );
}

export default SolicitationStack;
