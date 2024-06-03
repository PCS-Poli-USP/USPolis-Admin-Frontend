import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, Text } from '@chakra-ui/react';
import DataTable from 'components/common/DataTable/dataTable.component';
import Navbar from 'components/common/NavBar/navbar.component';
import { getDepartmentColumns } from './Tables/department.table';

function Department() {
  function handleCreateDepartmentButton() {
    console.log('Criar departamento');
  }
  const columns = getDepartmentColumns({});

  return (
    <>
      <Navbar />
      <Flex paddingX={4} direction={'column'}>
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Text fontSize={'4xl'} mb={4}>
            Departamentos
          </Text>
          <Button leftIcon={<AddIcon />} onClick={handleCreateDepartmentButton}>
            Cadastrar
          </Button>
        </Flex>
        <DataTable data={[]} columns={columns} />
      </Flex>
    </>
  );
}

export default Department;
