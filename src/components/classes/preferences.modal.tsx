import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from '@chakra-ui/react';
import Class, { Preferences } from 'models/class.model';
import { Buildings } from 'models/enums/buildings.enum';

import { useEffect, useState } from 'react';

interface PreferencesForm extends Preferences {
  has_to_be_allocated: boolean;
}

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Class; // data from database
  onSave: (data: PreferencesForm) => void;
}

export default function PreferencesModal(props: PreferencesModalProps) {
  const buildingsOptions = Object.values(Buildings);

  const initialForm: PreferencesForm = {
    building: Buildings.BIENIO,
    has_to_be_allocated: true,
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    // set data from database
    if (props.data) setForm({ ...props.data.preferences, has_to_be_allocated: props.data.has_to_be_allocated });
  }, [props.data]);

  function handleSaveClick() {
    if (isEmpty(form.building)) return;

    props.onSave(form);
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
        <ModalHeader>Preferências</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isInvalid={isEmpty(form.building)}>
            <FormLabel>Prédio</FormLabel>

            <Select
              value={form.building}
              onChange={(event) => setForm((prev) => ({ ...prev, building: event.target.value as Buildings }))}
            >
              {buildingsOptions.map((it) => (
                <option key={it} value={it}>
                  {it}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mt={4}>
            <HStack>
              <Checkbox
                isChecked={form.accessibility}
                onChange={(event) => setForm((prev) => ({ ...prev, accessibility: event.target.checked }))}
              >
                Acessibilidade
              </Checkbox>
              <Checkbox
                isChecked={form.air_conditioning}
                onChange={(event) => setForm((prev) => ({ ...prev, air_conditioning: event.target.checked }))}
              >
                Ar Condicionado
              </Checkbox>
              <Checkbox
                isChecked={form.projector}
                onChange={(event) => setForm((prev) => ({ ...prev, projector: event.target.checked }))}
              >
                Projetor
              </Checkbox>
            </HStack>
          </FormControl>

          <FormControl mt={4}>
            <Checkbox
              isChecked={form.has_to_be_allocated}
              onChange={(event) => setForm((prev) => ({ ...prev, has_to_be_allocated: event.target.checked }))}
            >
              Turma deve ser alocada obrigatoriamente
            </Checkbox>
          </FormControl>
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
