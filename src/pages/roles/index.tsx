import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
} from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import RolesTab from './RolesTab/RolesTab';
import UsersTab from './UsersTab/UsersTab';
import PermissionTab from './PermissionTab/PermissionTab';
import RoleModal from './RoleModal/RoleModal';

function Roles() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <PageContent>
      <RoleModal
        isOpen={isOpen}
        onClose={onClose}
        isUpdate={false}
        handleClose={() => {
          onClose();
        }}
        handleSave={() => {}}
      />
      <Tabs size={'md'}>
        <TabList>
          <Tab>Gerenciar Cargos</Tab>
          <Tab>Gerenciar Permissões</Tab>
          <Tab>Gerenciar Usuários</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RolesTab
              roles={[]}
              handleOpenRoleModal={() => {
                onOpen();
              }}
            />
          </TabPanel>
          <TabPanel>
            <PermissionTab />
          </TabPanel>
          <TabPanel>
            <UsersTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </PageContent>
  );
}

export default Roles;
