import {
  Button,
  Box,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  VStack,
} from '@chakra-ui/react';
import { EventByClassrooms } from 'models/event.model';

interface ClassEventProps {
  classEvent: EventByClassrooms;
}

export function ClassEvent(props: ClassEventProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button bg='#408080' textColor='white' w='full'>
          {props.classEvent.subjectCode}
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader
          fontSize='xl'
          fontWeight='bold'
        >{`${props.classEvent.subjectCode} - Turma ${props.classEvent.classCode}`}</PopoverHeader>
        <PopoverCloseButton size='xl' />

        <PopoverBody>
          <VStack bg='white' spacing={2} alignItems='start'>
            <Box>
              <Text fontSize='xl' fontWeight='bold'>
                Professores
              </Text>
              {(props.classEvent.professors as string[]).map((professor, index) => (
                <Text fontSize='lg' key={index}>
                  {professor}
                </Text>
              ))}
            </Box>

            <Box>
              <Text fontSize='xl' fontWeight='bold'>
                Informações
              </Text>
              <Text fontSize='lg'>{`Sala: ${
                props.classEvent.classroom ? props.classEvent.classroom : 'NÃO ALOCADA'
              }`}</Text>
              <Text fontSize='lg'>{`Horário: ${props.classEvent.startTime} - ${props.classEvent.endTime}`}</Text>
              <Text fontSize='lg'>{`Inscritos: ${props.classEvent.subscribers}`}</Text>
            </Box>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
