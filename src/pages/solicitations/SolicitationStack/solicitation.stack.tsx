import {
  Checkbox,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  StackDivider,
  VStack,
} from '@chakra-ui/react';
import { ClassroomSolicitationResponse } from '../../../models/http/responses/classroomSolicitation.response.models';
import { useEffect, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import SolicitationStackBody from './solicitation.stack.body';
import { filterString } from '../../../utils/filters';

interface SolicitationStackProps {
  solicitations: ClassroomSolicitationResponse[];
  handleOnClick: (data: ClassroomSolicitationResponse) => void;
  reset: () => void;
  selectedIndex?: number;
  setSelectedIndex: (index: number) => void;
  loading: boolean;
  handleShowAll: (showAll: boolean) => void;
}

function SolicitationStack({
  solicitations,
  handleOnClick,
  reset,
  selectedIndex,
  setSelectedIndex,
  loading,
  handleShowAll,
}: SolicitationStackProps) {
  const [current, setCurrent] = useState<ClassroomSolicitationResponse[]>([]);
  const [filtered, setFiltered] = useState<ClassroomSolicitationResponse[]>([]);
  const [buildingSearch, setBuildingSearch] = useState('');
  const [classroomSearch, setClassroomSearch] = useState('');
  const [requesterSearch, setRequesterSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

  function filterSolicitation(
    building: string,
    classroom: string,
    requester: string,
  ) {
    let newCurrent = [...solicitations];
    if (building)
      newCurrent = newCurrent.filter((val) =>
        filterString(val.building, building),
      );
    if (classroom)
      newCurrent = newCurrent.filter((val) =>
        val.classroom
          ? filterString(val.classroom, classroom)
          : filterString('não especificada', classroom),
      );
    if (requester)
      newCurrent = newCurrent.filter((val) =>
        filterString(val.user, requester),
      );
    setFiltered(newCurrent);
  }

  useEffect(() => {
    setCurrent([...solicitations]);
    filterSolicitation(buildingSearch, classroomSearch, requesterSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solicitations]);

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
      <Checkbox
        isChecked={showAll}
        onChange={(e) => {
          setShowAll(e.target.checked);
          handleShowAll(e.target.checked);
        }}
      >
        Exibir aprovados/negados do semestre
      </Checkbox>
      <Skeleton isLoaded={!loading} w={'full'}>
        <SolicitationStackBody
          reset={reset}
          setSelectedIndex={setSelectedIndex}
          selectedIndex={selectedIndex}
          solicitations={
            buildingSearch || classroomSearch || requesterSearch
              ? filtered.filter((val) => showAll || !val.closed)
              : current.filter((val) => showAll || !val.closed)
          }
          handleOnClick={handleOnClick}
        />
      </Skeleton>
    </VStack>
  );
}

export default SolicitationStack;
