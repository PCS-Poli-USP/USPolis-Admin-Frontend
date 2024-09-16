import {
  Checkbox,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  StackDivider,
  VStack,
} from '@chakra-ui/react';
import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';
import { useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import SolicitationStackBody from './solicitation.stack.body';

interface SolicitationStackProps {
  solicitations: ClassroomSolicitationResponse[];
  handleOnClick: (data: ClassroomSolicitationResponse) => void;
}

function SolicitationStack({
  solicitations,
  handleOnClick,
}: SolicitationStackProps) {
  const [hidden, setHidden] = useState(true);
  const [current, setCurrent] = useState<ClassroomSolicitationResponse[]>([]);
  const [filtered, setFiltered] = useState<ClassroomSolicitationResponse[]>([]);
  const [buildingSearch, setBuildingSearch] = useState('');
  const [classroomSearch, setClassroomSearch] = useState('');
  const [requesterSearch, setRequesterSearch] = useState('');

  function filterSolicitation(
    building: string,
    classroom: string,
    requester: string,
  ) {
    let newCurrent = [...current];
    if (building)
      newCurrent = newCurrent.filter((val) =>
        val.building.toLowerCase().includes(building.toLowerCase()),
      );
    if (classroom)
      newCurrent = newCurrent.filter((val) =>
        val.classroom
          ? val.classroom.toLowerCase().includes(classroom)
          : 'não especificada'.includes(classroom.toLowerCase()),
      );
    if (requester)
      newCurrent = newCurrent.filter((val) =>
        val.user.toLowerCase().includes(requester.toLowerCase()),
      );
    setFiltered(newCurrent);
  }

  useEffect(() => {
    if (hidden) {
      const initial = [
        ...solicitations.filter((solicitation) => !solicitation.closed),
      ];
      setCurrent(initial);
      setFiltered((prev) => prev.filter((val) => !val.closed));
    } else {
      setCurrent([...solicitations]);
      setFiltered((prev) => {
        // if (prev.length === 0) return [...solicitations];
        return prev;
      });
    }
  }, [hidden, solicitations]);

  return (
    <VStack
      divider={<StackDivider border={'1px solid lightgray'} />}
      alignItems={'flex-start'}
      alignContent={'flex-start'}
      w={'full'}
      spacing={2}
      paddingRight={5}
    >
      <Heading w={'full'} fontWeight={'bold'} textAlign={'center'}>
        Solicitações
      </Heading>
      <HStack>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <BsSearch color='gray.300' />
          </InputLeftElement>
          <Input
            type='text'
            placeholder='Filtrar por Prédio'
            value={buildingSearch}
            onChange={(event) => {
              setBuildingSearch(event.target.value);
              filterSolicitation(
                event.target.value,
                classroomSearch,
                requesterSearch,
              );
            }}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <BsSearch color='gray.300' />
          </InputLeftElement>
          <Input
            type='text'
            placeholder='Filtrar por Sala'
            value={classroomSearch}
            onChange={(event) => {
              setClassroomSearch(event.target.value);
              filterSolicitation(
                buildingSearch,
                event.target.value,
                requesterSearch,
              );
            }}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftElement pointerEvents='none'>
            <BsSearch color='gray.300' />
          </InputLeftElement>
          <Input
            type='text'
            placeholder='Filtrar por Solicitante'
            value={requesterSearch}
            onChange={(event) => {
              setRequesterSearch(event.target.value);
              filterSolicitation(
                buildingSearch,
                classroomSearch,
                event.target.value,
              );
            }}
          />
        </InputGroup>
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
        solicitations={
          buildingSearch || classroomSearch || requesterSearch
            ? filtered
            : current
        }
        handleOnClick={handleOnClick}
      />
    </VStack>
  );
}

export default SolicitationStack;
