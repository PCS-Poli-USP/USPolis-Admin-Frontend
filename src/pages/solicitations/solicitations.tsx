import { Box, Text, VStack } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';

import PageContent from '../../components/common/PageContent';
import SolicitationStack from './SolicitationStack/solicitation.stack';
import SolicitationPanel from './SolicitationPanel/solicitation.panel';
import useClassroomsSolicitations from '../../hooks/solicitations/useSolicitations';
import { SolicitationResponse } from '../../models/http/responses/solicitation.response.models';
import { PageSize } from '../../utils/enums/pageSize.enum';
import { appContext } from '../../context/AppContext';

function Solicitations() {
  const { isMobile } = useContext(appContext);
  const {
    loading,
    solicitations,
    pageResponse,
    getPendingBuildingSolicitations,
    getAllBuildingSolicitations,
    approveSolicitation,
    denySolicitation,
  } = useClassroomsSolicitations(false);
  const [selectedSolicitation, setSelectedSolicitation] = useState<
    SolicitationResponse | undefined
  >(undefined);
  const [solicitationsPaginated, setSolicitationsPaginated] = useState<
    Array<SolicitationResponse>
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(PageSize.SIZE_5);

  async function fetchData() {
    await getPendingBuildingSolicitations();
    await getAllBuildingSolicitations(1, pageSize);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSolicitationsPaginated((prev) => {
      if (pageResponse.page <= 1) return pageResponse.data;
      const seen = new Set(prev.map((s) => s.id));
      const newItems = pageResponse.data.filter((s) => !seen.has(s.id));
      return newItems.length > 0 ? [...prev, ...newItems] : prev;
    });
  }, [pageResponse]);

  return (
    <PageContent>
      <VStack
        align={'stretch'}
        spacing={{ base: '12px', md: '16px' }}
        maxW={'1040px'}
        mx={'auto'}
        w={'full'}
        h={isMobile ? 'auto' : 'full'}
        minH={0}
        overflow={isMobile ? 'visible' : 'hidden'}
      >
        <Box flexShrink={0}>
          <Text
            fontSize={{ base: '26px', md: '32px' }}
            fontWeight={'normal'}
            color={'uspolis.text'}
            lineHeight={1.15}
          >
            Solicitações
          </Text>
          <Text fontSize={'15px'} color={'uspolis.textMuted'}>
            Analise e responda os pedidos de reserva de sala dos seus prédios.
          </Text>
        </Box>

        <SolicitationStack
          pendingSolicitations={solicitations}
          solicitationsPaginated={solicitationsPaginated}
          handleOnClick={setSelectedSolicitation}
          loading={loading}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={pageResponse.total_pages}
          handleShowMore={async (page) => {
            await getAllBuildingSolicitations(page, pageSize);
          }}
        />
      </VStack>

      <SolicitationPanel
        handleClose={() => setSelectedSolicitation(undefined)}
        solicitation={selectedSolicitation}
        approve={async (id, data) => {
          await approveSolicitation(id, data);
          setSelectedSolicitation(undefined);
        }}
        deny={async (id, data) => {
          await denySolicitation(id, data);
          setSelectedSolicitation(undefined);
        }}
        refetch={async () => {
          await fetchData();
        }}
        loading={loading}
      />
    </PageContent>
  );
}

export default Solicitations;
