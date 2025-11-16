import { Grid, GridItem } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import SolicitationStack from './SolicitationStack/solicitation.stack';
import SolicitationPanel from './SolicitationPanel/solicitation.panel';
import useClassroomsSolicitations from '../../hooks/solicitations/useSolicitations';
import { useEffect, useState } from 'react';
import { SolicitationResponse } from '../../models/http/responses/solicitation.response.models';
import { PageSize } from '../../utils/enums/pageSize.enum';

function Solicitations() {
  const {
    loading,
    solicitations,
    pageResponse,
    getPendingBuildingSolicitations,
    getAllBuildingSolicitations,
    approveSolicitation,
    denySolicitation,
  } = useClassroomsSolicitations(false);
  const [fetchPages, setFetchPages] = useState(false);
  const [selectedSolicitation, setSelectedSolicitation] = useState<
    SolicitationResponse | undefined
  >(undefined);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined,
  );
  const [solicitationsPaginated, setSolicitationsPaginated] = useState<
    Array<SolicitationResponse>
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PageSize.SIZE_5);

  async function fetchData() {
    await getPendingBuildingSolicitations();
    await getAllBuildingSolicitations(1, pageSize);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fetchPages) {
      if (pageResponse.data) {
        setSolicitationsPaginated((prev) => [...prev, ...pageResponse.data]);
      }
    }
    if (!fetchPages && pageResponse.data) {
      setSolicitationsPaginated(pageResponse.data);
      setFetchPages(true);
    }
  }, [pageResponse, fetchPages]);

  return (
    <PageContent>
      <Grid gridTemplateColumns={'40% 60%'} h={'calc(100vh - 120px)'} gap={4}>
        <GridItem
          borderRight={'2px'}
          h={'100%'}
          border={'2px'}
          borderRadius={'10px'}
          borderColor={'lightgray'}
          p={'10px'}
          overflowY={'hidden'}
        >
          <SolicitationStack
            selectedSolicitation={selectedSolicitation}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            pendingSolicitations={solicitations}
            solicitationsPaginated={solicitationsPaginated}
            handleOnClick={setSelectedSolicitation}
            reset={() => setSelectedSolicitation(undefined)}
            loading={loading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={pageResponse.total_pages}
            totalItems={pageResponse.total_items}
            handleShowMore={async (page) => {
              await getAllBuildingSolicitations(page, pageSize);
            }}
          />
        </GridItem>
        <GridItem
          overflow={'auto'}
          w={'100%'}
          h={'100%'}
          p={'0px 20px 0px 0px'}
        >
          <SolicitationPanel
            handleClose={() => {
              setSelectedIndex(undefined);
              setSelectedSolicitation(undefined);
            }}
            solicitation={selectedSolicitation}
            approve={async (id, data) => {
              await approveSolicitation(id, data);
              setSelectedSolicitation(undefined);
            }}
            deny={async (id, data) => {
              await denySolicitation(id, data);
              setSelectedSolicitation(undefined);
            }}
            loading={loading}
          />
        </GridItem>
      </Grid>
    </PageContent>
  );
}

export default Solicitations;
