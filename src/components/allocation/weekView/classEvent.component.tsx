import { Button, Flex, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Spacer, Text } from '@chakra-ui/react';
import { EventByClassrooms } from 'models/event.model';

interface ClassEventProps {
  classEvent: EventByClassrooms;
}

export function ClassEvent(props: ClassEventProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button colorScheme='teal' w='full'>{props.classEvent.subjectCode}</Button> 
      </PopoverTrigger>

      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight='bold'>{`${props.classEvent.subjectCode} - Turma ${props.classEvent.classCode}`}</PopoverHeader>

        <PopoverBody>
          <Flex direction='column'>
            <Text fontWeight='bold'>Professores</Text>
            {props.classEvent.professors.map((professor) => (
              <Text>{professor}</Text>
            ))}
            <Spacer />
            <Text fontWeight='bold'>Informações</Text>
            <Text>{`Sala: ${props.classEvent.classroom}`}</Text>
            <Text>{`Horário: ${props.classEvent.startTime} - ${props.classEvent.endTime}`}</Text>
            <Text>{`Inscritos: ${props.classEvent.subscribers}`}</Text>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}