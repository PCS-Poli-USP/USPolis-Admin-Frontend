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
        <Button bg={'#408080'} textColor={props.classEvent.has_to_be_allocated ? 'red.300' : 'white'} w='full'>
          {props.classEvent.subject_code}
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader
          fontSize='xl'
          fontWeight='bold'
        >{`${props.classEvent.subject_code} - Turma ${props.classEvent.class_code}`}</PopoverHeader>
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
              <Text fontSize='lg'>{`Horário: ${props.classEvent.start_time} - ${props.classEvent.end_time}`}</Text>
              <Text fontSize='lg'>{`Inscritos: ${props.classEvent.subscribers}`}</Text>
            </Box>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
