import { useContext, useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  TabIndicator,
  Skeleton,
} from '@chakra-ui/react';
import Conflict from '../../models/http/responses/conflict.response.models';
import PageContent from '../../components/common/PageContent';
import { AllocateClassModal } from '../../pages/classes/AllocateClassModal';
import useConflictsService from '../../hooks/API/services/useConflictsService';
import useCustomToast from '../../hooks/useCustomToast';
import UnintentionalConflictsTab from './UnintentionalConflictsTab';
import IntentionalConflictsTab from './IntentionalConflictsTab';
import { ConflictType } from '../../utils/enums/conflictType.enum';
import TooltipSelect from '../../components/common/TooltipSelect';
import { appContext } from '../../context/AppContext';
import { BuildingResponse } from '../../models/http/responses/building.response.models';
import useBuildings from '../../hooks/useBuildings';
import PageHeaderWithFilter from '../../components/common/PageHeaderWithFilter';
import usePageHeaderWithFilter from '../../components/common/PageHeaderWithFilter/usePageHeaderWithFilter';

const ConflictsPage = () => {
  const { loading: loadingUser, loggedUser } = useContext(appContext);
  const { loading: loadingBuildings, buildings } = useBuildings();

  const { start, end, setStart, setEnd } = usePageHeaderWithFilter();

  const showToast = useCustomToast();
  const conflictsService = useConflictsService();

  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  const [conflicts, setConflicts] = useState<Conflict | null>(null);
  const [intentionalConflicts, setIntentionalConflicts] =
    useState<Conflict | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [buildingOptions, setBuildingOptions] = useState<BuildingResponse[]>(
    [],
  );
  const [selectedBuilding, setSelectedBuilding] = useState<number>();

  const [isOpenAllocate, setIsOpenAllocate] = useState<boolean>(false);
  const [selectedClassId, setSelectedClassId] = useState<number>(0);

  useEffect(() => {
    if (loggedUser && !loggedUser.is_admin) {
      setBuildingOptions(loggedUser.buildings || []);
    }

    if (loggedUser && loggedUser.is_admin && buildings) {
      setBuildingOptions(buildings);
    }
  }, [loggedUser, buildings, loadingUser, loadingBuildings]);

  useEffect(() => {
    if (!initialLoad && buildingOptions.length === 1) {
      setInitialLoad(true);
      fetchData(buildingOptions[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildingOptions, initialLoad, loggedUser]);

  async function fetchData(building_id: number, start?: string, end?: string) {
    setLoading(true);
    await conflictsService
      .listByBuilding(building_id, ConflictType.UNINTENTIONAL, start, end)
      .then((res) => {
        setConflicts(res.data);
      })
      .catch((err) => {
        console.error(err);
        showToast('Erro', 'Erro ao carregar conflitos', 'error');
      });

    await conflictsService
      .listByBuilding(building_id, ConflictType.INTENTIONAL, start, end)
      .then((res) => {
        setIntentionalConflicts(res.data);
      })
      .catch((err) => {
        console.error(err);
        showToast('Erro', 'Erro ao carregar conflitos intencionais', 'error');
      });
    setLoading(false);
  }

  return (
    <PageContent>
      <Flex paddingX={4} direction={'column'}>
        <Flex>
          <PageHeaderWithFilter
            title={'Conflitos'}
            tooltip='Ver conflitos de outros períodos'
            start={start}
            end={end}
            setStart={setStart}
            setEnd={setEnd}
            onConfirm={(start, end) => {
              if (selectedBuilding) fetchData(selectedBuilding, start, end);
            }}
          />
        </Flex>
        <Flex direction={'row'} gap={4} mb={4}>
          <Flex direction={'column'} flex={1}>
            <Text fontSize={'md'}>Prédio:</Text>
            <TooltipSelect
              placeholder={'Selecione o prédio'}
              isDisabled={loading || buildingOptions.length <= 1}
              options={buildingOptions.map((it) => ({
                value: it.id,
                label: it.name,
              }))}
              onChange={(option) => {
                if (option) {
                  setSelectedBuilding(option.value as number);
                  fetchData(option.value as number);
                } else setSelectedBuilding(undefined);
              }}
              isLoading={loading}
            />
          </Flex>
          {/* <Flex direction={'column'} flex={1}>
            <Text fontSize={'md'}>Início:</Text>
            <Input
              type='date'
              value={start}
              onChange={(e) => {
                const date = moment(e.target.value);
                if (date.isValid()) {
                  const newStart = date.format('YYYY-MM-DD');
                  setStart(newStart);
                  setChangePeriod(true);
                  if (date.isAfter(moment(end))) {
                    setEnd(newStart);
                  }
                }
              }}
              max={end}
            />
          </Flex>
          <Flex direction={'column'} flex={1}>
            <Text fontSize={'md'}>Fim:</Text>
            <Input
              type='date'
              value={end}
              min={start}
              onChange={(e) => {
                const date = moment(e.target.value);
                if (date.isValid()) {
                  const newEnd = date.format('YYYY-MM-DD');
                  setEnd(newEnd);
                  setChangePeriod(true);
                  if (date.isBefore(moment(start))) {
                    setStart(newEnd);
                  }
                }
              }}
            />
          </Flex>
          <Flex direction={'column-reverse'}>
            <Button
              rightIcon={<CheckIcon />}
              onClick={() => {
                if (selectedBuilding && changePeriod) {
                  fetchData(selectedBuilding);
                  setChangePeriod(false);
                }
              }}
            >
              Confirmar novo período
            </Button>
          </Flex> */}
        </Flex>
        <Tabs position='relative' variant='unstyled'>
          <TabList>
            <Tab>
              <Text fontSize='3xl' color={'red.600'}>
                Não intencionais
              </Text>
            </Tab>
            <Tab>
              <Text fontSize='3xl'>Intencionais</Text>
            </Tab>
          </TabList>
          <TabIndicator
            mt='-1.5px'
            height='2px'
            bg='uspolis.blue'
            borderRadius='1px'
          />
          <TabPanels>
            <TabPanel>
              <Skeleton isLoaded={!loading}>
                <UnintentionalConflictsTab
                  conflictSpec={conflicts}
                  setSelectedClassId={(id) => {
                    setSelectedClassId(id);
                  }}
                  setIsOpenAllocate={(value) => {
                    setIsOpenAllocate(value);
                  }}
                />
              </Skeleton>
            </TabPanel>
            <TabPanel>
              <Skeleton isLoaded={!loading}>
                <IntentionalConflictsTab
                  conflictSpec={intentionalConflicts}
                  setSelectedClassId={(id) => {
                    setSelectedClassId(id);
                  }}
                  setIsOpenAllocate={(value) => {
                    setIsOpenAllocate(value);
                  }}
                />
              </Skeleton>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
      <AllocateClassModal
        isOpen={isOpenAllocate}
        onClose={() => {
          setIsOpenAllocate(false);
          setSelectedClassId(0);
        }}
        refresh={() => {
          if (selectedBuilding) fetchData(selectedBuilding);
        }}
        class_id={selectedClassId}
      />
    </PageContent>
  );
};

export default ConflictsPage;
