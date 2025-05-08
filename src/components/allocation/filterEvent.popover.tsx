import {
  Button,
  FormLabel,
  HStack,
  Input,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  VStack,
} from '@chakra-ui/react';

import { BsSearch } from 'react-icons/bs';

interface FilterEventPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  filterFn: (classVal: string, classroomVal: string) => void;
  handleSubjectChange: (newValue: string) => void;
  handleClassroomChange: (newValue: string) => void;
  subjectSearchValue: string;
  classroomSearchValue: string;
}

export function FilterEventPopover(props: FilterEventPopoverProps) {
  function handleClosePopover() {
    props.handleClassroomChange('');
    props.handleSubjectChange('');
    props.onClose();
  }

  function handleFilterClick() {
    props.filterFn(props.subjectSearchValue, props.classroomSearchValue);
    props.onClose();
  }

  return (
    <Popover
      isOpen={props.isOpen}
      onClose={props.onClose}
      placement='right-end'
      closeOnBlur={false}
    >
      <PopoverContent p={5} w='500px' ml='700px' mt='40px'>
        <PopoverHeader fontWeight='bold'>Filtrar Alocações</PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />

        <PopoverBody>
          <HStack spacing={5}>
            <VStack alignItems='start' spacing={0} w='full'>
              <FormLabel fontWeight='bold'>Disciplina</FormLabel>
              <Input
                type='text'
                value={props.subjectSearchValue}
                onChange={(event) =>
                  props.handleSubjectChange(event.target.value)
                }
              />
            </VStack>

            <VStack alignItems='start' spacing={0} w='full'>
              <FormLabel fontWeight='bold'>Sala</FormLabel>
              <Input
                type='text'
                value={props.classroomSearchValue}
                onChange={(event) =>
                  props.handleClassroomChange(event.target.value)
                }
              />
            </VStack>
          </HStack>
        </PopoverBody>

        <PopoverFooter
          border='0'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          pb={4}
        >
          <Button colorScheme='red' mr={5} onClick={handleClosePopover}>
            Cancelar
          </Button>
          <Button
            leftIcon={<BsSearch />}
            colorScheme='teal'
            variant='solid'
            onClick={handleFilterClick}
          >
            Filtrar
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}
