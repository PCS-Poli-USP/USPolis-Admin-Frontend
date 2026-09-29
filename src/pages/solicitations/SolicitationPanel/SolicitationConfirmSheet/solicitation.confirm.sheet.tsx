import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useContext } from 'react';

import { appContext } from '../../../../context/AppContext';

interface SolicitationConfirmSheetProps {
  isOpen: boolean;
  mode: 'approve' | 'deny';
  title: string;
  summaryLine: string;
  justification: string;
  onJustificationChange: (value: string) => void;
  justificationError: boolean;
  remaining: number;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function SolicitationConfirmSheet({
  isOpen,
  mode,
  title,
  summaryLine,
  justification,
  onJustificationChange,
  justificationError,
  remaining,
  isLoading,
  onCancel,
  onConfirm,
}: SolicitationConfirmSheetProps) {
  const { isMobile } = useContext(appContext);
  const isDeny = mode === 'deny';

  const content = (
    <VStack align={'stretch'} spacing={'16px'} p={isMobile ? '4px 4px 8px' : '4px'}>
      <VStack align={'stretch'} spacing={'6px'}>
        <Text fontSize={'19px'} fontWeight={'bold'} color={'uspolis.text'}>
          {isDeny ? 'Negar solicitação?' : 'Aprovar solicitação?'}
        </Text>
        <Text fontSize={'15px'} lineHeight={1.5} color={'uspolis.text'}>
          <Text as={'strong'}>Essa ação é irreversível.</Text>{' '}
          {isDeny
            ? 'Uma vez negada, não será possível mudar o estado da solicitação. A justificativa será enviada ao solicitante por email.'
            : 'Uma vez aprovada, a sala será reservada e a solicitação não poderá mudar seu estado.'}
        </Text>
      </VStack>

      <VStack
        align={'stretch'}
        spacing={'2px'}
        p={'10px 12px'}
        borderRadius={'6px'}
        bg={'uspolis.surfaceSubtle'}
        fontSize={'14px'}
      >
        <Text fontWeight={'medium'}>{title}</Text>
        <Text color={'uspolis.textMuted'}>{summaryLine}</Text>
      </VStack>

      {isDeny && (
        <VStack align={'stretch'} spacing={'6px'}>
          <Text fontSize={'14px'} fontWeight={'bold'}>
            Justificativa
          </Text>
          <Textarea
            value={justification}
            onChange={(event) => onJustificationChange(event.target.value.slice(0, 256))}
            maxLength={256}
            rows={4}
            placeholder={'Explique ao solicitante o motivo da negação'}
            borderColor={justificationError ? 'red.300' : undefined}
          />
          <Box display={'flex'} justifyContent={'space-between'} fontSize={'13px'}>
            <Text color={'red.500'} visibility={justificationError ? 'visible' : 'hidden'}>
              Campo obrigatório
            </Text>
            <Text color={'uspolis.textMuted'}>{`Caracteres restantes: ${remaining}`}</Text>
          </Box>
        </VStack>
      )}

      <Box display={'flex'} gap={'8px'} justifyContent={'flex-end'}>
        <Button
          flex={isMobile ? 1 : 'none'}
          variant={'ghost'}
          onClick={onCancel}
          isDisabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          flex={isMobile ? 1 : 'none'}
          colorScheme={isDeny ? 'red' : 'green'}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          Confirmar
        </Button>
      </Box>
    </VStack>
  );

  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} placement={'bottom'} onClose={onCancel}>
        <DrawerOverlay zIndex={'modal'} />
        <DrawerContent borderTopRadius={'16px'} zIndex={'modal'}>
          <DrawerBody p={'16px'}>{content}</DrawerBody>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onCancel} isCentered>
      <ModalOverlay zIndex={'modal'} />
      <ModalContent maxW={'460px'} zIndex={'modal'}>
        <ModalBody p={'20px'}>{content}</ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default SolicitationConfirmSheet;
