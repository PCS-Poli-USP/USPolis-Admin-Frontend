import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
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
} from '@chakra-ui/react';
import { appContext } from 'context/AppContext';
import { Building } from 'models/building.model';
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
  const { dbUser } = useContext(appContext);

  const buildingsService = new BuildingsService();

  const [subjectsList, setSubjectsList] = useState(subjects);
  const [subjectInput, setSubjectInput] = useState('');
  const [buildingIdSelection, setBuildingIdSelection] = useState<
    string | undefined
  >(undefined);
  const [buildingsList, setBuildingsList] = useState<Building[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialFocusRef = useRef(null);

  function handleAddClick() {
    if (subjectInput.length > 0 && !subjectsList.includes(subjectInput))
      setSubjectsList((prev) => [...prev, subjectInput]);

    setSubjectInput('');
  }

  function handleCleanClick() {
    setSubjectsList([]);
  }

  function handleConfirmClick() {
    if (buildingIdSelection !== undefined && subjectsList.length > 0) {
      onSave(subjectsList, buildingIdSelection);
      onClose();
    }
  }

  function getBuildingsList() {
    if (dbUser) {
      if (dbUser.isAdmin) {
        buildingsService.list().then((response) => {
          setBuildingsList(response.data);
        });
      } else {
        setBuildingsList(dbUser.buildings);
      }
    }
  }

  useEffect(() => {
    getBuildingsList();
  }, [dbUser]);

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
          <Select
            placeholder='selecionar prédio'
            onChange={(event) => setBuildingIdSelection(event.target.value)}
          >
            {buildingsList.map((it) => (
              <option key={it.id} value={it.id}>
                {it.name}
              </option>
            ))}
          </Select>
        </PopoverBody>
        <PopoverBody maxH='2xs' overflowY='auto'>
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
              <Flex>
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
              </Flex>
            </PopoverFooter>
          )}
      </PopoverContent>
    </Popover>
  );
}
