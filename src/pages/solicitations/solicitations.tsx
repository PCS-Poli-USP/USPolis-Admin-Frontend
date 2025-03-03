import { Grid, GridItem } from '@chakra-ui/react';
import PageContent from 'components/common/PageContent';
import SolicitationStack from './SolicitationStack/solicitation.stack';
import SolicitationPanel from './SolicitationPanel/solicitation.panel';
import useClassroomsSolicitations from 'hooks/useClassroomSolicitations';
import { useState } from 'react';
import { ClassroomSolicitationResponse } from 'models/http/responses/classroomSolicitation.response.models';

function Solicitations() {
  const { loading, solicitations, approveSolicitation, denySolicitation } =
    useClassroomsSolicitations();
  const [solicitation, setSolicitation] = useState<
    ClassroomSolicitationResponse | undefined
  >(undefined);

  return (
    <PageContent>
      <Grid gridTemplateColumns={'40% 60%'} h={'calc(100vh - 140px)'} gap={4}>
        <GridItem
          borderRight={'2px'}
          h={'100%'}
          borderColor={'lightgray'}
          overflowY={'auto'}
        >
          <SolicitationStack
            solicitations={solicitations}
            handleOnClick={setSolicitation}
            reset={() => setSolicitation(undefined)}
          />
        </GridItem>
        <GridItem overflow={'auto'} w={'100%'} p={'0px 20px 0px 0px'}>
          <SolicitationPanel
            reset={() => {}}
            handleClose={() => setSolicitation(undefined)}
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
