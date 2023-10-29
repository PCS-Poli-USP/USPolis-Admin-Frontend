import { Button, Checkbox, Flex, FormControl, FormLabel, Heading, Input } from '@chakra-ui/react';
import Navbar from 'components/common/navbar.component';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { Building } from 'models/building.model';
import BuildingsService from 'services/buildings.service';
import UsersService from 'services/users.service';

const buildingsService = new BuildingsService();
const usersService = new UsersService();

interface RegisterUserFormValues {
  username: string;
  email: string;
  buildings: BuildingOption[];
  isAdmin: boolean;
}

interface BuildingOption {
  value: string;
  label: string;
}

const initialForm: RegisterUserFormValues = {
  username: '',
  email: '',
  buildings: [],
  isAdmin: false,
};

const RegisterUser = () => {
  const [form, setForm] = useState(initialForm);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
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

  async function registerUser() {
    try {
      setIsLoadingRegister(true);
      const response = await usersService.create({
        email: form.email,
        username: form.username,
        isAdmin: form.isAdmin,
        building_ids: form.isAdmin ? undefined : form.buildings.map((it) => it.value),
      });
      setIsLoadingRegister(false);
      setForm(initialForm);
      alert('Usuário cadastrado com sucesso!');
    } catch (err) {
      setIsLoadingRegister(false);
      alert('Erro ao cadastrar usuário!');
      console.error(err);
    }
  }

  return (
    <>
      <Navbar />
      <Flex maxW={600} margin={'auto'} marginTop={4} paddingX={4} gap={4} direction={'column'}>
        <Heading alignSelf={'center'}>Cadastrar Usuário</Heading>
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder='Username'
            value={form.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
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
              onChange={(selected) => {
                const selectedBuildings = selected as BuildingOption[];
                setForm((prev) => ({ ...prev, buildings: selectedBuildings }));
              }}
              value={form.buildings}
            />
          </FormControl>
        )}
        <Button disabled={isLoadingRegister} onClick={registerUser}>
          Cadastrar
        </Button>
      </Flex>
    </>
  );
};

export default RegisterUser;
