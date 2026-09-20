import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  HStack,
  Text,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { useContext, useState } from 'react';
import { PiChair } from 'react-icons/pi';
import { appContext } from '../../../context/AppContext';
import GroupFormatter from '../../../utils/groups/group.formatter';

// Legacy groups — kept only for accounts that still carry them; de-emphasized on purpose.
function ProfileLegacyGroups() {
  const { loggedUser } = useContext(appContext);
  const [expandedGroups, setExpandedGroups] = useState<number[]>([0]);

  const groups = loggedUser?.groups || [];
  if (groups.length === 0) return null;

  const allExpanded = expandedGroups.length === groups.length;

  return (
    <Box mt={'20px'}>
      <HStack spacing={'8px'} align={'baseline'}>
        <Text
          fontSize={'10.5px'}
          fontWeight={'bold'}
          letterSpacing={'0.07em'}
          textTransform={'uppercase'}
          color={'uspolis.textMuted'}
        >
          Acesso legado
        </Text>
        <Button
          size={'xs'}
          variant={'link'}
          fontWeight={'normal'}
          fontSize={'11.5px'}
          color={'uspolis.textMuted'}
          onClick={() =>
            setExpandedGroups(allExpanded ? [] : groups.map((_, index) => index))
          }
        >
          {allExpanded ? 'recolher' : 'expandir'}
        </Button>
      </HStack>
      <Text fontSize={'12px'} color={'uspolis.textMuted'} mt={'2px'} mb={'10px'} maxW={'70ch'}>
        Grupos antigos ainda vinculados à sua conta, mantidos por compatibilidade.
      </Text>

      <Accordion
        allowMultiple
        index={expandedGroups}
        onChange={(indexes) => setExpandedGroups(indexes as number[])}
        display={'flex'}
        flexDirection={'column'}
        gap={'8px'}
      >
        {groups.map((group, index) => (
          <AccordionItem
            key={index}
            border={'1px solid'}
            borderColor={'uspolis.border'}
            borderRadius={'8px'}
            overflow={'hidden'}
          >
            <AccordionButton py={'8px'} px={'12px'} _hover={{ bg: 'uspolis.hover' }}>
              <VStack align={'flex-start'} spacing={'1px'} flex={1}>
                <Text fontWeight={'medium'} color={'uspolis.textMuted'} fontSize={'13px'}>
                  {GroupFormatter.getGroupName(group)}
                </Text>
                <Text fontSize={'11.5px'} color={'uspolis.textMuted'}>
                  {`${group.building} · ${group.classroom_strs.length} ${
                    group.classroom_strs.length === 1 ? 'sala' : 'salas'
                  }`}
                </Text>
              </VStack>
              {expandedGroups.includes(index) ? (
                <MinusIcon fontSize='10px' />
              ) : (
                <AddIcon fontSize='10px' />
              )}
            </AccordionButton>
            <AccordionPanel px={'12px'} pb={'12px'} pt={0}>
              <Divider borderColor={'uspolis.border'} mb={'10px'} />
              {group.classroom_strs.length === 0 ? (
                <Text fontSize={'12px'} color={'uspolis.textMuted'}>
                  Esse grupo não possui salas.
                </Text>
              ) : (
                <Wrap spacing={'6px 18px'}>
                  {group.classroom_strs.map((classroom, classroomIndex) => (
                    <HStack key={classroomIndex} spacing={'5px'}>
                      <PiChair size={13} color={'#a5a4a8'} />
                      <Text fontSize={'12.5px'} color={'uspolis.textMuted'}>
                        {classroom}
                      </Text>
                    </HStack>
                  ))}
                </Wrap>
              )}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
}

export default ProfileLegacyGroups;
