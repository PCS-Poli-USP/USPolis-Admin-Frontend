import {
  Button,
  Checkbox,
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
  Select,
} from '@chakra-ui/react';
import { appContext } from 'context/AppContext';
import { Building } from 'models/common/building.model';
import Classroom, { ClassroomCreate } from 'models/common/classroom.model';
import { User } from 'models/common/user.common.model';
import { BuildingResponse } from 'models/http/responses/building.response.models';

import { useContext, useEffect, useState } from 'react';
import BuildingsService from 'services/api/buildings.service';
import UsersService from 'services/api/users.service';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData?: ClassroomCreate;
  isUpdate: boolean;
  onSave: (data: ClassroomCreate) => void;
}

export default function RegisterModal(props: RegisterModalProps) {
  const { loggedUser } = useContext(appContext);
  const buildingsService = new BuildingsService();
  const usersService = new UsersService();
  const [usersList, setUsersList] = useState<User[]>([]);
  const [buildingsList, setBuildingsList] = useState<BuildingResponse[]>([]);

  const initialForm: ClassroomCreate = {
    name: '',
    building_id: '',
    floor: 0,
    capacity: 0,
    ignore_to_allocate: false,
    air_conditioning: false,
    projector: false,
    accessibility: false,
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (props.formData) setForm(props.formData);
    else setForm(initialForm);
  }, [props.formData]);

  useEffect(() => {
    getBuildingsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser]);

  function getBuildingsList() {
    if (loggedUser) {
      if (loggedUser.is_admin) {
        buildingsService.list().then((response) => {
          setBuildingsList(response.data);
        });
      } else {
        setBuildingsList(loggedUser.buildings || []);
      }
    }
  }

  function handleSaveClick() {
    if (isEmpty(form.name)) return;
    props.onSave(form);
    clearForm();
    props.onClose();
  }

  function handleCloseModal() {
    clearForm();
    props.onClose();
  }

  function clearForm() {
    setForm(initialForm);
  }

  function isEmpty(value: string) {
    return value.length <= 0;
  }

  return (
    <Modal isOpen={props.isOpen} onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {props.isUpdate ? 'Editar informações da sala' : 'Cadastrar uma sala'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isInvalid={isEmpty(form.name)}>
            <FormLabel>Nome</FormLabel>
            <Input
              placeholder='Nome'
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />
          </FormControl>

          <FormControl
            mt={4}
            isInvalid={isEmpty(form.building_id)}
            isDisabled={props.isUpdate}
          >
            <FormLabel>Prédio</FormLabel>
            <Select
              placeholder={'Escolha um prédio'}
              onChange={(event) => {
                setForm((prev) => ({
                  ...prev,
                  building_id: event.target.value,
                }));
              }}
              value={form.building_id}
            >
              {buildingsList.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Andar</FormLabel>
            <NumberInput
              placeholder='Andar'
              value={form.floor}
              onChange={(_, value) =>
                setForm((prev) => ({
                  ...prev,
                  floor: isNaN(value) ? 0 : value,
                }))
              }
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Capacidade</FormLabel>
            <NumberInput
              placeholder='Capacidade'
              value={form.capacity}
              onChange={(_, value) =>
                setForm((prev) => ({
                  ...prev,
                  capacity: isNaN(value) ? 0 : value,
                }))
              }
              min={0}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Recursos</FormLabel>
            <HStack>
              <Checkbox
                isChecked={form.air_conditioning}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    air_conditioning: event.target.checked,
                  }))
                }
              >
                Ar Condicionado
              </Checkbox>
              <Checkbox
                isChecked={form.projector}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    projector: event.target.checked,
                  }))
                }
              >
                Projetor
              </Checkbox>
              <Checkbox
                isChecked={form.accessibility}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    accessibility: event.target.checked,
                  }))
                }
              >
                Acessibilidade
              </Checkbox>
            </HStack>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Alocação</FormLabel>
            <Checkbox
              isChecked={form.ignore_to_allocate}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  ignore_to_allocate: event.target.checked,
                }))
              }
            >
              Ignorar para alocar
            </Checkbox>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleSaveClick}>
            Salvar
          </Button>
          <Button onClick={() => handleCloseModal()}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
