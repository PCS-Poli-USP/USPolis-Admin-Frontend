import {
  Button,
  ButtonGroup,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdManageSearch } from 'react-icons/md';
import PageContent from '../../components/common/PageContent';
import PageHeader from '../../components/common/PageHeader';
import DocumentsPanel from './DocumentsPanel';
import QueriesPanel from './QueriesPanel';

export { SEARCH_LOG_LIST_LIMIT } from './QueriesPanel';
export { SEARCH_DOCUMENT_LIST_LIMIT } from './DocumentsPanel';

// Windows offered; the backend caps the queries at SEARCH_LOG_RETENTION_DAYS.
export const SEARCH_LOG_DAY_OPTIONS = [7, 30, 90, 365];

function SearchLogs() {
  const [days, setDays] = useState(30);
  const [tab, setTab] = useState(0);

  return (
    <PageContent>
      <Flex direction={'column'} gap={5} w={'full'} maxW={'1100px'} mx={'auto'}>
        <PageHeader
          title={'Registro de buscas'}
          subtitle={'O que as pessoas procuram e o que abrem na busca geral'}
          leftIcon={<MdManageSearch size={'32px'} />}
        />

        {/* Each panel fetches on its own; isLazy keeps the hidden one idle. */}
        <Tabs index={tab} onChange={setTab} variant={'enclosed'} isLazy>
          <Flex
            justify={'space-between'}
            align={'flex-end'}
            gap={3}
            wrap={'wrap'}
          >
            <TabList>
              <Tab>Consultas</Tab>
              <Tab>Documentos</Tab>
            </TabList>
            <ButtonGroup
              size={'sm'}
              isAttached
              variant={'outline'}
              aria-label={'Período'}
              mb={2}
            >
              {SEARCH_LOG_DAY_OPTIONS.map((d) => (
                <Button
                  key={d}
                  variant={days === d ? 'solid' : 'outline'}
                  colorScheme={days === d ? 'blue' : 'gray'}
                  aria-pressed={days === d}
                  onClick={() => setDays(d)}
                >
                  {d} dias
                </Button>
              ))}
            </ButtonGroup>
          </Flex>
          <TabPanels>
            <TabPanel px={0}>
              <QueriesPanel days={days} />
            </TabPanel>
            <TabPanel px={0}>
              <DocumentsPanel days={days} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </PageContent>
  );
}

export default SearchLogs;
