import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Flex,
  Alert,
  AlertIcon,
  IconButton,
} from '@chakra-ui/react';
import { ModalProps } from '../../../models/interfaces';
import { Input } from '../../../components/common';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  defaultValues,
  schema,
  TimetableCrawlForm,
} from './TimetableCrawlModal.form';
import { useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

interface TimetableCrawlModalProps extends ModalProps {
  handleSubmit: (data: TimetableCrawlForm) => void;
}

function TimetableCrawlModal({
  isOpen,
  onClose,
  handleSubmit,
}: TimetableCrawlModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<TimetableCrawlForm>({
    defaultValues: defaultValues,
    resolver: yupResolver(schema),
  });

  function handleConfirm() {
    const isValid = form.trigger();

    if (!isValid) {
      return;
    }

    handleSubmit(form.getValues());
    form.reset();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'lg'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Importar Grade Horária do JupiterWeb</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction={'column'} gap={'20px'}>
            <Text>
              Insira seu número USP e senha institucional para importar sua
              grade horária do JupiterWeb.
            </Text>
            <FormProvider {...form}>
              <form>
                <Input label='Número USP' name='nusp' mb={'20px'} type='tel' />
                <Input
                  label='Senha'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  iconPosition='right'
                  icon={
                    <IconButton
                      aria-label='show-password'
                      icon={showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant={'ghost'}
                      colorScheme='blue'
                    />
                  }
                />
              </form>
            </FormProvider>
            <Alert
              status='info'
              colorScheme={'blue'}
              borderRadius={'10px'}
              fontWeight={'bold'}
            >
              <AlertIcon />O USPolis não armazena suas credenciais, elas são
              utilizadas apenas para importar sua grade horária.
            </Alert>
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme={'red'}
            variant={'outline'}
            mr={3}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button colorScheme={'blue'} onClick={handleConfirm}>
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default TimetableCrawlModal;
