import { Grid, GridItem } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import SolicitationStack from './SolicitationStack/solicitation.stack';
import SolicitationPanel from './SolicitationPanel/solicitation.panel';
import useClassroomsSolicitations from '../../hooks/solicitations/useSolicitations';
import { useEffect, useState } from 'react';
import { SolicitationResponse } from '../../models/http/responses/solicitation.response.models';

function Solicitations() {
  const {
    loading,
    solicitations,
    getPendingBuildingSolicitations,
    getAllBuildingSolicitations,
    approveSolicitation,
    denySolicitation,
  } = useClassroomsSolicitations(false);
  const [solicitation, setSolicitation] = useState<
    SolicitationResponse | undefined
  >(undefined);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined,
  );

  const [loadedAll, setLoadedAll] = useState(false);

  useEffect(() => {
    getPendingBuildingSolicitations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          overflowY={'auto'}
        >
          <SolicitationStack
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            solicitations={solicitations}
            handleOnClick={setSolicitation}
            reset={() => setSolicitation(undefined)}
            loading={loading}
            handleShowAll={(showAll) => {
              if (!loadedAll && showAll) {
                getAllBuildingSolicitations();
                setLoadedAll(showAll);
              }

              if (!showAll) {
                getPendingBuildingSolicitations();
                setLoadedAll(showAll);
              }
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
              setSolicitation(undefined);
            }}
            solicitation={solicitation}
            approve={async (id, data) => {
              await approveSolicitation(id, data);
              setSolicitation(undefined);
            }}
            deny={async (id, data) => {
              await denySolicitation(id, data);
              setSolicitation(undefined);
            }}
            loading={loading}
          />
        </GridItem>
      </Grid>
    </PageContent>
  );
}

export default Solicitations;
