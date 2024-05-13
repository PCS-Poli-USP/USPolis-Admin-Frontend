import { AddIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Spacer,
  Select,
  UnorderedList,
  useDisclosure,
  Spinner,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { appContext } from 'context/AppContext';
import { Building } from 'models/database/building.model';
import { useContext, useEffect, useRef, useState } from 'react';
import BuildingsService from 'services/buildings.service';

interface JupiterCrawlerPopoverPrpos {
  subjects?: string[];
  onSave: (subjectsList: string[], building_id: string) => void;
}

export default function JupiterCrawlerPopover({
  subjects = [],
  onSave,
}: JupiterCrawlerPopoverPrpos) {
  const { loggedUser } = useContext(appContext);

  const buildingsService = new BuildingsService();

  const [subjectsList, setSubjectsList] = useState(subjects);
  const [subjectInput, setSubjectInput] = useState('');
  const [multSubjectInput, setMultSubjectInput] = useState('');
  const [buildingIdSelection, setBuildingIdSelection] = useState<
    string | undefined
  >(undefined);
  const [buildingsList, setBuildingsList] = useState<Building[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialFocusRef = useRef(null);
  const [buildingsLoading, setBuildingsLoading] = useState(true);

  useEffect(() => {
    if (buildingsList.length === 1) {
      setBuildingIdSelection(buildingsList[0].id);
    }
  }, [buildingsList]);

  useEffect(() => {
    getBuildingsList();
  }, [loggedUser]);

  function handleAddClick() {
    if (subjectInput.length === 7 && !subjectsList.includes(subjectInput)) {
      setSubjectsList((prev) => [...prev, subjectInput.replace(' ', '')]);
      setSubjectInput('');
    }
    if (multSubjectInput.length > 6) {
      const formatedInput = multSubjectInput.replaceAll(' ', '');
      const subjects = formatedInput
        .split(',')
        .filter((value) => value.length === 7 && !subjectsList.includes(value));
      setSubjectsList((prev) => prev.concat(subjects));
      setMultSubjectInput('');
    }
  }

  function handleCleanClick() {
    setSubjectsList([]);
  }

  function handleConfirmClick() {
    if (buildingIdSelection !== undefined && subjectsList.length > 0) {
      setSubjectsList([]);
      onSave(subjectsList, buildingIdSelection);
      onClose();
    }
  }

  function getBuildingsList() {
    if (loggedUser) {
      if (loggedUser.is_admin) {
        setBuildingsLoading(true);
        buildingsService.list().then((response) => {
          setBuildingsList(response.data);
          setBuildingsLoading(false);
        });
      } else {
        setBuildingsList(loggedUser.buildings);
      }
    }
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      initialFocusRef={initialFocusRef}
    >
      <PopoverTrigger>
        <Button colorScheme='blue'>Adicionar pelo JupiterWeb</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverCloseButton />
        <PopoverHeader>Disciplinas</PopoverHeader>
        <PopoverBody>
          {buildingsList.length !== 1 && (
            <Select
              placeholder='Selecionar prédio'
              onChange={(event) => setBuildingIdSelection(event.target.value)}
              icon={buildingsLoading ? <Spinner size='sm' /> : undefined}
            >
              {buildingsList.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.name}
                </option>
              ))}
            </Select>
          )}
        </PopoverBody>
        <PopoverBody maxH='xl' overflowY='auto'>
          <Text mb={2}>Adicionar manualmente:</Text>
          <InputGroup>
            <Input
              value={subjectInput}
              onChange={(event) =>
                setSubjectInput(event.target.value.toUpperCase())
              }
              placeholder='Código da disciplina'
              ref={initialFocusRef}
              onKeyDownCapture={(e) => {
                if (e.key === 'Enter') handleAddClick();
              }}
            />
            <InputRightElement>
              <IconButton
                aria-label='Add subbject'
                size='sm'
                colorScheme='blue'
                icon={<AddIcon />}
                onClick={handleAddClick}
              />
            </InputRightElement>
          </InputGroup>

          <Text mt={4}>Adicionar uma lista:</Text>
          <InputGroup>
            <Input
              value={multSubjectInput}
              onChange={(event) =>
                setMultSubjectInput(event.target.value.toUpperCase())
              }
              placeholder='Códigos das disciplinas'
              onKeyDownCapture={(e) => {
                if (e.key === 'Enter') handleAddClick();
              }}
            />
            <InputRightElement>
              <IconButton
                aria-label='Add subbject'
                size='sm'
                colorScheme='blue'
                icon={<AddIcon />}
                onClick={handleAddClick}
              />
            </InputRightElement>
          </InputGroup>
          <Text as={'b'} fontSize={'sm'} noOfLines={1} mt={2}>
            *Separe os códigos usando vírgula
          </Text>
          <Text as={'b'} fontSize={'sm'} noOfLines={1}>
            *Não se preocupe com espaços
          </Text>

          <Text mt={4}>Lista de disciplinas: ({subjectsList.length})</Text>
          <UnorderedList p={2}>
            {subjectsList.map((it) => (
              <ListItem key={it}>{it}</ListItem>
            ))}
          </UnorderedList>
        </PopoverBody>
        {subjectsList.length > 0 &&
          buildingIdSelection !== undefined &&
          buildingIdSelection !== '' && (
            <PopoverFooter>
              <VStack>
                {subjectsList.length > 10 ? (
                  <Alert status={'warning'} fontSize={'sm'}>
                    <AlertIcon />
                    Isso pode levar algum tempo
                  </Alert>
                ) : undefined}
                <HStack alignSelf={'flex-end'}>
                  <Button
                    colorScheme='yellow'
                    size='sm'
                    variant='outline'
                    onClick={handleCleanClick}
                  >
                    Limpar
                  </Button>
                  <Spacer />
                  <Button
                    colorScheme='blue'
                    size='sm'
                    onClick={handleConfirmClick}
                  >
                    Confirmar
                  </Button>
                </HStack>
              </VStack>
            </PopoverFooter>
          )}
      </PopoverContent>
    </Popover>
  );
}
