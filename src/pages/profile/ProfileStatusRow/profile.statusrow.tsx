import {
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Switch,
  Tag,
  Text,
  Wrap,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { LiaBuilding } from 'react-icons/lia';
import { LuCalendarDays, LuMail, LuMailX } from 'react-icons/lu';
import { appContext } from '../../../context/AppContext';
import HelpPopover from '../../../components/common/HelpPopover';
import useUsers from '../../../hooks/users/useUsers';
import {
  getUserBuildings,
  getUserBuildingsBadgeColor,
  hasElevatedAccess,
} from '../../../utils/users/users.formatter';

function ProfileStatusRow() {
  const { loggedUser, getSelfFromBackend } = useContext(appContext);
  const { updateUserEmailNotifications } = useUsers(false);
  if (!loggedUser) return null;

  const showElevatedStatus = hasElevatedAccess(loggedUser);

  return (
    <Wrap
      spacing={'14px 40px'}
      align={'center'}
      py={'16px'}
      borderBottom={'1px solid'}
      borderColor={'uspolis.border'}
    >
      {showElevatedStatus && (
        <>
          <FormControl display={'flex'} alignItems={'center'} w={'fit-content'}>
            {loggedUser.receive_emails ? <LuMail size={18} /> : <LuMailX size={18} />}
            <FormLabel
              htmlFor='email-alerts'
              fontSize={'15px'}
              fontWeight={'bold'}
              color={'uspolis.text'}
              ml={'8px'}
              mb={0}
            >
              Notificações por email
            </FormLabel>
            <Switch
              id='email-alerts'
              isChecked={loggedUser.receive_emails}
              mr={'6px'}
              onChange={async (e) => {
                await updateUserEmailNotifications(e.target.checked);
                await getSelfFromBackend();
              }}
            />
            <HelpPopover title='O que é notificado?'>
              <Flex direction={'column'} gap={'5px'}>
                <Text fontWeight={'bold'}>Para responsáveis por prédios:</Text>
                <Text fontSize={'sm'}>
                  Uma reserva foi criada/cancelada e ela estiver no seu prédio ou for em uma sala
                  que você tem permissão.
                </Text>
              </Flex>
            </HelpPopover>
          </FormControl>

          <HStack spacing={'10px'}>
            <LuCalendarDays size={18} />
            <Text fontSize={'15px'} fontWeight={'bold'} color={'uspolis.text'}>
              Grade horária
            </Text>
            <Tag
              colorScheme={loggedUser.current_schedule_id ? 'green' : 'red'}
              fontSize={'11.5px'}
              fontWeight={'bold'}
              letterSpacing={'0.04em'}
              textTransform={'uppercase'}
              borderRadius={'4px'}
            >
              {loggedUser.current_schedule_id ? 'Cadastrada' : 'Não registrada'}
            </Tag>
          </HStack>
        </>
      )}

      <HStack spacing={'10px'}>
        <LiaBuilding size={18} />
        <Text fontSize={'15px'} fontWeight={'bold'} color={'uspolis.text'}>
          Prédios
        </Text>
        <Tag
          colorScheme={getUserBuildingsBadgeColor(loggedUser)}
          fontSize={'11.5px'}
          fontWeight={'bold'}
          letterSpacing={'0.04em'}
          textTransform={'uppercase'}
          borderRadius={'4px'}
        >
          {getUserBuildings(loggedUser)}
        </Tag>
      </HStack>
    </Wrap>
  );
}

export default ProfileStatusRow;
