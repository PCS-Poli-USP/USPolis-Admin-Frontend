import {
  Button,
  FormControl,
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

import { CreateBuilding } from '../../../models/http/requests/building.request.models';

import { useEffect, useState } from 'react';

interface BuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData?: CreateBuilding;
  isUpdate?: boolean;
  onSave: (data: CreateBuilding) => void;
}

export default function BuildingModal(props: BuildingModalProps) {
  const initialForm: CreateBuilding = {
    name: '',
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (props.formData) setForm(props.formData);
  }, [props.formData]);

  function handleSaveClick() {
    if (isEmpty(form.name)) return;

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
        <ModalHeader>
          {props.isUpdate
            ? 'Editar informações do prédio'
            : 'Cadastrar um prédio'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isInvalid={isEmpty(form.name)}>
            <FormLabel>Nome</FormLabel>
            <Input
              placeholder='Nome'
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button onClick={props.onClose} colorScheme='red' mr={'10px'}>
            Cancelar
          </Button>
          <Button colorScheme='blue' onClick={handleSaveClick}>
            {props.isUpdate ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
