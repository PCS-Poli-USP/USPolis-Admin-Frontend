import { Button, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Input } from '@chakra-ui/react';
import Navbar from 'components/common/navbar.component';
import { useEffect, useState } from 'react';
import { Field, Form, Formik, FormikErrors, FormikProps, withFormik } from 'formik';
import Select from 'react-select';
import { Building } from 'models/building.model';
import BuildingsService from 'services/buildings.service';

const buildingsService = new BuildingsService();

interface RegisterUserFormValues {
  name: string;
  email: string;
  buildings: string[];
  isAdmin: boolean;
}

const initialForm: RegisterUserFormValues = {
  name: '',
  email: '',
  buildings: [],
  isAdmin: false,
};

const RegisterUser = () => {
  const [form, setForm] = useState(initialForm);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(true);

  useEffect(() => {
    fetchBuildings();
  }, []);

  async function fetchBuildings() {
    try {
      const response = await buildingsService.list();
      console.log(response.data);
      setBuildings(response.data);
      setIsLoadingBuildings(false);
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        fetchBuildings();
      }, 5000);
    }
  }

  return (
    <>
      <Navbar />
      <Flex maxW={600} margin={'auto'} marginTop={4} paddingX={4} gap={4} direction={'column'}>
        <Heading alignSelf={'center'}>Cadastrar Usuário</Heading>
        <FormControl>
          <FormLabel>Nome</FormLabel>
          <Input
            placeholder='Nome'
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder='Email'
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
        </FormControl>
        <Checkbox
          isChecked={form.isAdmin}
          onChange={(e) => setForm((prev) => ({ ...prev, isAdmin: e.target.checked }))}
        >
          Administrador
        </Checkbox>
        {!form.isAdmin && (
          <FormControl>
            <FormLabel>Prédios</FormLabel>
            <Select
              placeholder={isLoadingBuildings ? 'Carregando...' : 'Selecione um ou mais'}
              isLoading={isLoadingBuildings}
              isMulti
              options={buildings.map((it) => ({ value: it.id, label: it.name }))}
            />
          </FormControl>
        )}
        <Button
          onClick={() => {
            console.log(form);
          }}
        >
          Cadastrar
        </Button>
      </Flex>
    </>
  );
};

export default RegisterUser;
