import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import Select from 'react-select';
import { Building } from 'models/common/building.model';
import {
  nameInvalid,
  buildingsInvalid,
  emailInvalid,
  usernameInvalid,
} from 'utils/users/users.validator';

import { ChangeEvent, useEffect, useState } from 'react';
import BuildingsService from 'services/api/buildings.service';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: RegisterUserFormValues) => void;
}

export interface RegisterUserFormValues {
  name: string;
  username: string;
  email: string;
  buildings: BuildingOption[];
  isAdmin: boolean;
}

interface RegisterUserFormErrors {
  name: boolean;
  username: boolean;
  email: boolean;
  buildings: boolean;
  isAdmin: boolean;
}

interface BuildingOption {
  value: string;
  label: string;
}

export default function RegisterUserModal(props: RegisterModalProps) {
  const buildingsService = new BuildingsService();

  const initialForm: RegisterUserFormValues = {
    name: '',
    username: '',
    email: '',
    buildings: [],
    isAdmin: false,
  };

  const [isLoadingBuildings, setIsLoadingBuildings] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [form, setForm] = useState<RegisterUserFormValues>(initialForm);
  const [errors, setErrors] = useState<RegisterUserFormErrors>({
    name: false,
    username: false,
    email: false,
    buildings: false,
    isAdmin: false,
  });

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
      }, 1000);
    }
  }

  function handleSaveClick() {
    if (checkErrors()) return;
    props.onSave(form);
    setForm(initialForm);
    props.onClose();
  }

  function handleCloseModal() {
    props.onClose();
  }

  function isEmpty(value: string) {
    return value.length <= 0;
  }

  const handleChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/\s/g, '').toLowerCase();
    setForm((prev) => ({ ...prev, username: newValue }));
  };

  const checkErrors = () => {
    const newErrors: RegisterUserFormErrors = {
      name: nameInvalid(form.name),
      username: usernameInvalid(form.username),
      email: emailInvalid(form.email),
      buildings: buildingsInvalid(
        form.buildings.map((b) => b.value),
        form.isAdmin,
      ),
      isAdmin: false,
    };

    setErrors(newErrors);

    return (
      newErrors.name ||
      newErrors.username ||
      newErrors.email ||
      newErrors.buildings
    );
  };

  const clearErrors = () => {
    setErrors({
      name: false,
      username: false,
      email: false,
      buildings: false,
      isAdmin: false,
    });
  };

  return (
    <Modal isOpen={props.isOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{'Editar informações do usuário'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Flex direction={'column'} gap={4}>
            <FormControl isInvalid={errors.name}>
              <FormLabel>Nome Completo</FormLabel>
              <Input
                placeholder='Nome'
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
              />
              <FormErrorMessage>Nome é obrigatório</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.username}>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder='Username'
                value={form.username}
                onChange={handleChangeUsername}
              />
              <FormErrorMessage>Username é obrigatório</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder='Email'
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />
              <FormErrorMessage>Email invalido</FormErrorMessage>
            </FormControl>
            <FormControl>
              <Checkbox
                isChecked={form.isAdmin}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isAdmin: e.target.checked }))
                }
              >
                Administrador
              </Checkbox>
            </FormControl>
            {!form.isAdmin && (
              <FormControl isInvalid={errors.buildings}>
                <FormLabel>Prédios</FormLabel>
                <Select
                  placeholder={
                    isLoadingBuildings
                      ? 'Carregando...'
                      : 'Selecione um ou mais'
                  }
                  isLoading={isLoadingBuildings}
                  isMulti
                  options={buildings.map((it) => ({
                    value: it.id,
                    label: it.name,
                  }))}
                  onChange={(selected) => {
                    const selectedBuildings = selected as BuildingOption[];
                    setForm((prev) => ({
                      ...prev,
                      buildings: selectedBuildings,
                    }));
                  }}
                  value={form.buildings}
                />
                <FormErrorMessage>
                  Prédio é obrigatório para não administradores
                </FormErrorMessage>
              </FormControl>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
            Salvar
          </Button>
          <Button
            onClick={() => {
              clearErrors();
              props.onClose();
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
