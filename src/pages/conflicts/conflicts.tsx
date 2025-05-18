import { useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
  TabIndicator,
  Input,
  Skeleton,
} from '@chakra-ui/react';
import Conflict from '../../models/http/responses/conflict.response.models';
import PageContent from '../../components/common/PageContent';
import { AllocateClassModal } from '../../pages/classes/AllocateClassModal';
import useConflictsService from '../../hooks/API/services/useConflictsService';
import useCustomToast from '../../hooks/useCustomToast';
import Select from 'react-select';
import UnintentionalConflictsTab from './UnintentionalConflictsTab';
import IntentionalConflictsTab from './IntentionalConflictsTab';
import { ConflictType } from '../../utils/enums/conflictType.enum';
import moment from 'moment';

type Option = {
  value: string;
  label: string;
};

const ConflictsPage = () => {
  const showToast = useCustomToast();

  const conflictsService = useConflictsService();

  const [conflicts, setConflicts] = useState<Conflict[] | null>(null);
  const [intentionalConflicts, setIntentionalConflicts] = useState<
    Conflict[] | null
  >(null);

  const today = moment();

  const [loading, setLoading] = useState<boolean>(false);
  const [buildingNames, setBuildingNames] = useState<string[] | null>(null);
  const [selectedBuildingName, setSelectedBuildingName] = useState<string>('');
  const [start, setStart] = useState<string>(
    today.month() < 6
      ? moment({ year: today.year(), month: 0, day: 1 }).format('YYYY-MM-DD') // 1º janeiro
      : moment({ year: today.year(), month: 6, day: 1 }).format('YYYY-MM-DD'),
  );
  const [end, setEnd] = useState<string>(
    today.month() < 6
      ? moment({ year: today.year(), month: 5, day: 30 }).format('YYYY-MM-DD') // 1º janeiro
      : moment({ year: today.year(), month: 11, day: 31 }).format('YYYY-MM-DD'),
  );

  const [isOpenAllocate, setIsOpenAllocate] = useState<boolean>(false);
  const [selectedClassId, setSelectedClassId] = useState<number>(0);

  useEffect(() => {
    setBuildingNames(conflicts?.map((it) => it.name) || []);
  }, [conflicts]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, end]);

  async function fetchData() {
    setLoading(true);
    await conflictsService
      .list(start, end, ConflictType.UNINTENTIONAL)
      .then((res) => {
        setConflicts(res.data);
      })
      .catch((err) => {
        console.error(err);
        showToast('Erro', 'Erro ao carregar conflitos', 'error');
      });

    await conflictsService
      .list(start, end, ConflictType.INTENTIONAL)
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
        <Text fontSize='4xl' mb={4}>
          Conflitos
        </Text>
        <Flex direction={'row'} gap={4} mb={4}>
          <Flex direction={'column'} flex={1}>
            <Text fontSize={'md'}>Prédio:</Text>
            <Select
              placeholder={'Selecione o prédio'}
              options={
                buildingNames
                  ? buildingNames.map((it) => ({ value: it, label: it }))
                  : []
              }
              onChange={(option: Option | null) => {
                if (option) {
                  setSelectedBuildingName(option.value);
                } else setSelectedBuildingName('');
              }}
              isLoading={loading}
            />
          </Flex>
          <Flex direction={'column'} flex={1}>
            <Text fontSize={'md'}>Início:</Text>
            <Input
              type='date'
              value={start}
              onChange={(e) => {
                const date = moment(e.target.value);
                if (date.isValid()) {
                  const newStart = date.format('YYYY-MM-DD');
                  if (newStart != start) setStart(newStart);
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
                  if (newEnd != end) setEnd(newEnd);
                }
              }}
            />
          </Flex>
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
                  conflicts={conflicts}
                  selectedBuildingName={selectedBuildingName}
                  setSelectedClassId={setSelectedClassId}
                  setIsOpenAllocate={(value) => {
                    setIsOpenAllocate(value);
                  }}
                />
              </Skeleton>
            </TabPanel>
            <TabPanel>
              <Skeleton isLoaded={!loading}>
                <IntentionalConflictsTab
                  conflicts={intentionalConflicts}
                  selectedBuildingName={selectedBuildingName}
                  setSelectedClassId={setSelectedClassId}
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
        refresh={fetchData}
        class_id={selectedClassId}
      />
    </PageContent>
  );
};

export default ConflictsPage;
