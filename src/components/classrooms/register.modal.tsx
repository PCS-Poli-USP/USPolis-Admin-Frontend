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
import Classroom from 'models/common/classroom.model';
import { User } from 'models/common/user.common.model';

import { useContext, useEffect, useState } from 'react';
import BuildingsService from 'services/api/buildings.service';
import UsersService from 'services/api/users.service';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData?: Classroom;
  isUpdate: boolean;
  onSave: (data: Classroom) => void;
  buildingsOptions: Building[];
}

export default function RegisterModal(props: RegisterModalProps) {
  const { loggedUser } = useContext(appContext);
  const buildingsService = new BuildingsService();
  const usersService = new UsersService();
  const [usersList, setUsersList] = useState<User[]>([]);
  const [buildingsList, setBuildingsList] = useState<Building[]>([]);

  const initialForm: Classroom = {
    classroom_name: '',
    building: '',
    floor: 0,
    capacity: 0,
    ignore_to_allocate: false,
    air_conditioning: false,
    projector: false,
    accessibility: false,
    created_by: undefined,
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (props.formData) setForm(props.formData);
  }, [props.formData]);

  useEffect(() => {
    getBuildingsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser]);

  useEffect(() => {
    if (loggedUser?.isAdmin) {
      usersService.list().then((response) => {
        setUsersList(response.data.map((it) => it));
      });
    }
  }, [loggedUser]);

  function getBuildingsList() {
    if (loggedUser) {
      if (loggedUser.isAdmin) {
        buildingsService.list().then((response) => {
          setBuildingsList(response.data);
        });
      } else {
        setBuildingsList(loggedUser.buildings);
      }
    }
  }

  function handleSaveClick() {
    if (isEmpty(form.classroom_name)) return;
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
          <FormControl isInvalid={isEmpty(form.classroom_name)}>
            <FormLabel>Nome</FormLabel>
            <Input
              disabled={props.isUpdate}
              placeholder='Nome'
              value={form.classroom_name}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  classroom_name: event.target.value,
                }))
              }
            />
          </FormControl>

          <FormControl
            mt={4}
            isInvalid={isEmpty(form.building)}
            isDisabled={props.isUpdate}
          >
            <FormLabel>Prédio</FormLabel>
            <Select
              placeholder={'Escolha um prédio'}
              onChange={(event) => {
                setForm((prev) => ({
                  ...prev,
                  building: event.target.value,
                }));
              }}
            >
              {buildingsList.map((it) => (
                <option key={it.id} value={it.name}>
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

          {loggedUser?.isAdmin && (
            <FormControl mt={4}>
              <FormLabel>Criado por</FormLabel>
              <Select
                placeholder={'Escolha um usuário'}
                value={form.created_by}
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    created_by: event.target.value,
                  }));
                }}
              >
                {usersList.map((it) => (
                  <option key={it.id} value={it.username}>
                    {it.username}
                  </option>
                ))}
              </Select>
            </FormControl>
          )}
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
