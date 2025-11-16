import {
  Box,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import { SolicitationResponse } from '../../../models/http/responses/solicitation.response.models';
import { useContext, useEffect, useRef, useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import SolicitationStackBody from './solicitation.stack.body';
import { filterString } from '../../../utils/filters';
import { ReservationStatus } from '../../../utils/enums/reservations.enum';
import { appContext } from '../../../context/AppContext';
import TooltipSelect from '../../../components/common/TooltipSelect';
import { PageSize } from '../../../utils/enums/pageSize.enum';

interface SolicitationStackProps {
  pendingSolicitations: SolicitationResponse[];
  solicitationsPaginated: SolicitationResponse[];
  handleOnClick: (data: SolicitationResponse) => void;
  reset: () => void;
  selectedSolicitation?: SolicitationResponse;
  selectedIndex?: number;
  setSelectedIndex: (index: number) => void;
  loading: boolean;
  currentPage: number;
  setCurrentPage: (value: number) => void;
  pageSize: PageSize;
  setPageSize: (value: PageSize) => void;
  totalPages: number;
  totalItems: number;
  handleShowMore: (page: number) => Promise<void>;
}

function SolicitationStack({
  pendingSolicitations,
  solicitationsPaginated,
  handleOnClick,
  reset,
  selectedSolicitation,
  selectedIndex,
  setSelectedIndex,
  loading,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalPages,
  totalItems,
  handleShowMore,
}: SolicitationStackProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { loggedUser } = useContext(appContext);
  const userBuildings = loggedUser ? loggedUser.buildings || [] : [];
  const [current, setCurrent] = useState<SolicitationResponse[]>([]);
  const [filtered, setFiltered] = useState<SolicitationResponse[]>([]);
  const [buildingSearch, setBuildingSearch] = useState(
    userBuildings.length == 1 && !loggedUser?.is_admin
      ? userBuildings[0].name
      : '',
  );
  const [classroomSearch, setClassroomSearch] = useState('');
  const [requesterSearch, setRequesterSearch] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

  function filterSolicitation(
    building: string,
    classroom: string,
    requester: string,
    status: string,
  ) {
    let newCurrent = [...current];
    if (building)
      newCurrent = newCurrent.filter((val) =>
        filterString(val.building, building),
      );
    if (classroom)
      newCurrent = newCurrent.filter((val) =>
        val.reservation.classroom_name
          ? filterString(val.reservation.classroom_name, classroom)
          : filterString('não especificada', classroom),
      );
    if (requester)
      newCurrent = newCurrent.filter((val) =>
        filterString(val.user, requester),
      );
    if (status) {
      newCurrent = newCurrent.filter((val) =>
        filterString(ReservationStatus.translate(val.status), status),
      );
    }
    setFiltered(newCurrent);
  }

  useEffect(() => {
    const data = showAll ? solicitationsPaginated : pendingSolicitations;
    setCurrent([...data]);
    filterSolicitation(
      buildingSearch,
      classroomSearch,
      requesterSearch,
      statusSearch,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingSolicitations, solicitationsPaginated, showAll]);

  const hasFilter =
    buildingSearch || classroomSearch || requesterSearch || statusSearch;

  return (
    <VStack
      divider={<StackDivider border={'1px solid lightgray'} />}
      alignItems={'flex-start'}
      alignContent={'flex-start'}
      w={'full'}
      spacing={2}
      paddingRight={5}
      h={'calc(100vh - 160px)'}
    >
      <Heading w={'full'} fontWeight={'bold'} textAlign={'center'}>
        Solicitações
      </Heading>
      <HStack>
        <InputGroup hidden={userBuildings.length == 1 && !loggedUser?.is_admin}>
          <InputLeftElement pointerEvents='none'>
            <BsSearch color='gray.300' />
          </InputLeftElement>
          <Input
            type='text'
            placeholder='Prédio'
            value={buildingSearch}
            border={buildingSearch ? '1px solid' : undefined}
            onChange={(event) => {
              setBuildingSearch(event.target.value);
              filterSolicitation(
                event.target.value,
                classroomSearch,
                requesterSearch,
                statusSearch,
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
            placeholder='Sala'
            value={classroomSearch}
            border={classroomSearch ? '1px solid' : undefined}
            onChange={(event) => {
              setClassroomSearch(event.target.value);
              filterSolicitation(
                buildingSearch,
                event.target.value,
                requesterSearch,
                statusSearch,
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
            placeholder='Solicitante'
            value={requesterSearch}
            border={requesterSearch ? '1px solid' : undefined}
            onChange={(event) => {
              setRequesterSearch(event.target.value);
              filterSolicitation(
                buildingSearch,
                classroomSearch,
                event.target.value,
                statusSearch,
              );
            }}
          />
        </InputGroup>

        <InputGroup hidden={userBuildings.length == 1 && !loggedUser?.is_admin}>
          <InputLeftElement pointerEvents='none'>
            <BsSearch color='gray.300' />
          </InputLeftElement>
          <Input
            type='text'
            placeholder='Situação'
            value={statusSearch}
            border={statusSearch ? '1px solid' : undefined}
            onChange={(event) => {
              setStatusSearch(event.target.value);
              filterSolicitation(
                buildingSearch,
                classroomSearch,
                requesterSearch,
                event.target.value,
              );
            }}
          />
        </InputGroup>
      </HStack>
      <Flex
        direction={'row'}
        w={'full'}
        gap={'5px'}
        justifyContent={'space-between'}
      >
        <Checkbox
          isChecked={showAll}
          onChange={(e) => {
            setShowAll(e.target.checked);
          }}
        >
          Exibir aprovados/negados/antigos
        </Checkbox>
        {showAll && (
          <Box
            w={'fit-content'}
            flexDirection={'row'}
            display={'flex'}
            gap={'10px'}
            alignItems={'center'}
          >
            <Text>{`(${current.length}/${totalItems}) itens, ${currentPage} de ${totalPages} páginas`}</Text>
            <Box hidden>
              <TooltipSelect
                isDisabled
                isMulti={false}
                value={{ value: pageSize, label: `${pageSize} por página` }}
                options={PageSize.values().map((size) => ({
                  value: size,
                  label: `${size} por página`,
                }))}
                onChange={(opt) => {
                  if (opt) {
                    setPageSize(opt.value as PageSize);
                  }
                }}
              />
            </Box>
          </Box>
        )}
      </Flex>
      <Skeleton isLoaded={!loading} w={'full'} flex='1' overflow='hidden'>
        <Box ref={scrollRef} w='full' h='100%' overflowY='auto'>
          <SolicitationStackBody
            reset={reset}
            selectedSolicitation={selectedSolicitation}
            setSelectedIndex={setSelectedIndex}
            selectedIndex={selectedIndex}
            solicitations={hasFilter ? filtered : current}
            handleOnClick={handleOnClick}
            showAll={showAll}
            totalItems={totalItems}
            hasMore={currentPage < totalPages}
            handleShowMoreClick={async () => {
              const el = scrollRef.current;
              if (!el) return;

              const oldScrollTop = el.scrollTop;
              const oldScrollHeight = el.scrollHeight;

              console.log(oldScrollTop, oldScrollHeight);

              const nextPage = currentPage + 1;
              setCurrentPage(nextPage);
              await handleShowMore(nextPage);

              requestAnimationFrame(() => {
                const newScrollHeight = el.scrollHeight;

                el.scrollTop =
                  oldScrollTop + (newScrollHeight - oldScrollHeight);
              });
            }}
          />
        </Box>
      </Skeleton>
    </VStack>
  );
}

export default SolicitationStack;
