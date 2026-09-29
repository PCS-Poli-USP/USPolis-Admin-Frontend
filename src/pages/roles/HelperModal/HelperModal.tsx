import {
  Badge,
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { ModalProps } from '../../../models/interfaces';
import { Resource } from '../../../utils/enums/resources.enums';
import { PermissionAction } from '../../../utils/enums/actions.enums';

const HELP_SECTIONS: { resource: Resource; note: string }[] = [
  {
    resource: Resource.CLASSROOM,
    note: 'Permissões sobre uma sala específica (ou todas, via "Todos os recursos").',
  },
  {
    resource: Resource.BUILDING,
    note: 'Acesso de prédio costuma liberar as ações equivalentes em todas as salas do prédio.',
  },
  {
    resource: Resource.COURSE,
    note: 'Independente de salas e prédios.',
  },
];

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HelperModalProps extends ModalProps {}

function HelperModal({ isOpen, onClose }: HelperModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={'xl'}
      scrollBehavior='inside'
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>O que significam as permissões?</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={'20px'}>
          <Text fontSize={'13.5px'} color={'uspolis.gray'} mb={'18px'}>
            Um <b>papel</b> agrupa uma ou mais <b>permissões</b>. Cada permissão
            é sobre um recurso específico (uma sala, um prédio ou um curso) e
            define quais ações são permitidas nele. Um <b>usuário</b> recebe
            acesso ao ser atribuído a um papel.
          </Text>
          <Flex direction={'column'} gap={'16px'}>
            {HELP_SECTIONS.map((section) => (
              <Box key={section.resource}>
                <Text fontWeight={'bold'} color={'uspolis.blue'}>
                  {Resource.getIcon(section.resource)}{' '}
                  {Resource.translate(section.resource)}
                </Text>
                <Text fontSize={'13px'} color={'uspolis.gray'} mb={'8px'}>
                  {section.note}
                </Text>
                <Flex direction={'column'} gap={'6px'}>
                  {PermissionAction.getValues(section.resource).map(
                    (action) => (
                      <Flex key={action} gap={'8px'} align={'baseline'}>
                        <Badge colorScheme={'blue'} fontSize={'11px'}>
                          {PermissionAction.translate(action, section.resource)}
                        </Badge>
                        <Text fontSize={'13px'} color={'uspolis.gray'}>
                          {PermissionAction.describe(
                            action,
                            section.resource,
                          ) || ''}
                        </Text>
                      </Flex>
                    ),
                  )}
                </Flex>
              </Box>
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default HelperModal;
