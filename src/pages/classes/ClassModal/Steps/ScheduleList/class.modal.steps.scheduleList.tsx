import { Alert, AlertIcon, HStack, IconButton, List, ListItem, Text, Tooltip, VStack } from "@chakra-ui/react";
import { ScheduleData } from "../../class.modal.interface";
import { BsCalendar2WeekFill, BsFillPenFill, BsFillTrashFill } from "react-icons/bs";
import { scheduleToString } from "../class.modal.steps.utils";

interface ScheduleListProps {
  schedules: ScheduleData[];
  handleUpdateScheduleClick: (index: number) => void;
  handleDeleteScheduleClick: (index: number) => void;
}

function ScheduleList(props: ScheduleListProps) {
  return (
    <VStack align={'strech'}>
      <Text fontSize={'lg'} fontWeight={'bold'}>
        Agendas adicionadas
      </Text>
      {props.schedules.length > 0 ? (
        <List spacing={3}>
          {props.schedules.map((val, index) => (
            <ListItem key={index}>
              <HStack>
                <BsCalendar2WeekFill />
                <Text>{scheduleToString(val)}</Text>

                <Tooltip label='Editar'>
                  <IconButton
                    colorScheme='yellow'
                    size='sm'
                    variant='ghost'
                    aria-label='editar-valor'
                    icon={<BsFillPenFill />}
                    onClick={() => props.handleUpdateScheduleClick(index)}
                  />
                </Tooltip>

                <Tooltip label='Remover'>
                  <IconButton
                    colorScheme='red'
                    size='sm'
                    variant='ghost'
                    aria-label='remover-valor'
                    icon={<BsFillTrashFill />}
                    onClick={() => props.handleDeleteScheduleClick(index)}
                  />
                </Tooltip>
              </HStack>
            </ListItem>
          ))}
        </List>
      ) : undefined}
      {props.schedules.length === 0 ? (
        <Alert status='error' fontSize='sm' mt={4} w={450}>
          <AlertIcon />
          Nenhuma agenda foi adicionada
        </Alert>
      ) : undefined}
    </VStack>
  );
}

export default ScheduleList
