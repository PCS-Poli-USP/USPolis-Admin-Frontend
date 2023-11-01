import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import Select from 'react-select';
import { Building } from 'models/building.model';

import { useEffect, useState } from 'react';
import BuildingsService from 'services/buildings.service';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData?: EditUserFormValues;
  otherData?: EditUserOtherData;
  onSave: (data: EditUserFormValues) => void;
}

interface EditUserFormValues {
  buildings?: BuildingOption[];
  isAdmin?: boolean;
}

interface EditUserOtherData {
  username?: string;
  email?: string;
}

interface BuildingOption {
  value: string;
  label: string;
}

export default function EditUserModal(props: EditModalProps) {
  const buildingsService = new BuildingsService();

  const initialForm: EditUserFormValues = {
    buildings: [],
    isAdmin: false,
  };

  const [isLoadingBuildings, setIsLoadingBuildings] = useState(false);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [form, setForm] = useState<EditUserFormValues>(initialForm);

  useEffect(() => {
    if (props.formData) setForm(props.formData);
  }, [props.formData]);

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

  return (
    <Modal isOpen={props.isOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{'Editar informações do usuário'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Flex direction={'column'} gap={4}>
            <Flex direction={'column'}>
              <FormLabel>Username</FormLabel>
              <Input value={props.otherData?.username} disabled />
            </Flex>
            <Flex direction={'column'}>
              <FormLabel>Email</FormLabel>
              <Input value={props.otherData?.email} disabled />
            </Flex>
            <FormControl>
              <Checkbox
                isChecked={form.isAdmin}
                onChange={(e) => setForm((prev) => ({ ...prev, isAdmin: e.target.checked }))}
              >
                Administrador
              </Checkbox>
            </FormControl>
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
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
            Salvar
          </Button>
          <Button onClick={props.onClose}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
