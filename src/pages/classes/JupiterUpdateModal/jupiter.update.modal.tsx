import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Heading,
  Text,
  Checkbox,
  Stack,
  Progress,
} from '@chakra-ui/react';
import { ModalProps } from 'models/interfaces';
import { useEffect, useState } from 'react';

interface JupiterUpdateModalProps extends ModalProps {
  codes: string[];
  handleConfirm: (codes: string[]) => void;
  loading: boolean;
}

type SelectionMap = {
  code: string;
  selected: boolean;
};

function JupiterUpdateModal({
  isOpen,
  onClose,
  codes,
  loading,
  handleConfirm,
}: JupiterUpdateModalProps) {
  const [selectionMap, setSelectionMap] = useState<SelectionMap[]>([]);

  useEffect(() => {
    setSelectionMap(
      codes.map((code) => ({
        code,
        selected: false,
      })),
    );
  }, [codes]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      size={'xl'}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Atualizar Disciplinas e Turmas pelo JupiterWeb
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack gap={'10px'}>
            <Text>
              Selecione as disciplinas que deseja atualizar. As turmas
              relacionadas a essas disciplinas também serão atualizadas.
            </Text>
            <Heading size={'md'}>
              Selecionar Disciplinas ({codes.length})
            </Heading>
            <Stack direction={'column'} maxH={'300px'} overflowY={'auto'}>
              {codes.map((code, index) => (
                <Checkbox
                  key={index}
                  isChecked={
                    selectionMap[index] ? selectionMap[index].selected : false
                  }
                  onChange={(event) => {
                    const newSelectionMap = [...selectionMap];
                    newSelectionMap[index].selected = event.target.checked;
                    setSelectionMap(newSelectionMap);
                  }}
                >
                  {code}
                </Checkbox>
              ))}
            </Stack>
            <Stack direction={'row'}>
              <Button
                w={'fit-content'}
                colorScheme='blue'
                onClick={() =>
                  setSelectionMap(
                    codes.map((code) => ({ code, selected: true })),
                  )
                }
              >
                Selecionar tudo
              </Button>
              <Button
                w={'fit-content'}
                colorScheme='gray'
                onClick={() =>
                  setSelectionMap(
                    codes.map((code) => ({ code, selected: false })),
                  )
                }
              >
                Remover tudo
              </Button>
            </Stack>
            <Text
              color={'red.500'}
              hidden={selectionMap.filter((it) => it.selected).length < 5}
            >
              *Isso pode demorar devido a quantidade de disciplinas selecionadas
            </Text>
            {loading && <Progress size='xs' isIndeterminate />}
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={onClose}>
            Fechar
          </Button>
          <Button
            colorScheme={'blue'}
            isLoading={loading}
            onClick={() =>
              handleConfirm(
                selectionMap.filter((it) => it.selected).map((it) => it.code),
              )
            }
          >
            Atualizar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default JupiterUpdateModal;
