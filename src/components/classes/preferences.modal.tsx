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
import { Building } from 'models/building.model';

import { useEffect, useState } from 'react';

interface PreferencesForm extends Preferences {
  has_to_be_allocated: boolean;
}

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: Class; // data from database
  buildings: Array<Building>;
  onSave: (data: PreferencesForm) => void;
}

export default function PreferencesModal(props: PreferencesModalProps) {

  const initialForm: PreferencesForm = {
    building_id: '',
    has_to_be_allocated: true,
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    // set data from database
    if (props.data) setForm({ ...props.data.preferences, has_to_be_allocated: props.data.has_to_be_allocated });
  }, [props.data]);

  function handleSaveClick() {
    if (isEmpty(form.building_id)) return;

    props.onSave(form);
    setForm(initialForm);
    props.onClose();
  }

  function handleCloseModal() {
    if (props.data) setForm({ ...props.data.preferences, has_to_be_allocated: props.data.has_to_be_allocated });
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
          <FormControl isInvalid={isEmpty(form.building_id)}>
            <FormLabel>Prédio</FormLabel>

            <Select
              value={form.building_id}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, building_id: event.target.value }))
              }}
            >
              {props.buildings.map((it, index) => (
                <option key={index} value={it.id}>
                  {it.name}
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
          <Button onClick={handleCloseModal}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
