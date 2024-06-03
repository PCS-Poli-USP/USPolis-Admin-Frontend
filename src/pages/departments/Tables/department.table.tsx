import {
  Box,
  Button,
  HStack,
  IconButton,
  List,
  ListItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/react-table';
import { DepartmentResponse } from 'models/http/responses/department.responde.model';
import { BsFillPenFill, BsFillTrashFill } from 'react-icons/bs';
import {
  datetimeFormatter,
  subjectTypeFormatter,
} from 'utils/subjects/subjects.formatter';

interface DepartmentColumnsProps {}

export const getDepartmentColumns = (
  props: DepartmentColumnsProps,
): ColumnDef<DepartmentResponse>[] => [
  {
    accessorKey: 'name',
    header: 'Nome',
    maxSize: 300,
  },
  {
    accessorKey: 'abbreviation',
    header: 'Sigla',
  },
  {
    accessorKey: 'professors',
    header: 'Professores',
    cell: ({ row }) => (
      <Box>
        {row.original.professors?.map((professor, index) => (
          <Text
            maxW={425}
            overflowX={'hidden'}
            textOverflow={'ellipsis'}
            key={index}
          >
            {professor}
          </Text>
        ))}
      </Box>
    ),
  },
  {
    accessorKey: 'building',
    header: 'Prédios',
  },
  {
    accessorKey: 'subjects',
    header: 'Disciplinas',
    cell: ({ row }) =>
      row.original.subjects ? (
        <Popover>
          <PopoverTrigger>
            <Button>Disciplinas</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Disciplinas</PopoverHeader>
            <PopoverBody>
              <List>
                {row.original.subjects.map((subject, index) => (
                  <ListItem
                    key={index}
                  >{`${subject.code} - ${subject.name}`}</ListItem>
                ))}
              </List>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ) : (
        <Box>
          <Text>Sem disciplinas</Text>
        </Box>
      ),
  },
  {
    accessorKey: 'classrooms',
    header: 'Salas de Aula',
    cell: ({ row }) =>
      row.original.classrooms ? (
        <Popover>
          <PopoverTrigger>
            <Button>Salas de Aula</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Salas de Aula</PopoverHeader>
            <PopoverBody>
              <List>
                {row.original.classrooms.map((classroom, index) => (
                  <ListItem
                    key={index}
                  >{`${classroom.name} - ${classroom.capacity}`}</ListItem>
                ))}
              </List>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ) : (
        <Box>
          <Text>Sem salas de aula</Text>
        </Box>
      ),
  },
  {
    id: 'options',
    header: 'Opções',
    cell: ({ row }) => (
      <HStack spacing='0px'>
        <Tooltip label='Editar Disciplina'>
          <IconButton
            colorScheme='yellow'
            size='xs'
            variant='ghost'
            aria-label='editar-turma'
            icon={<BsFillPenFill />}
            // onClick={() => props.handleEditButton(row.original)}
          />
        </Tooltip>

        <Tooltip label='Excluir Disciplina'>
          <IconButton
            colorScheme='red'
            size='xs'
            variant='ghost'
            aria-label='excluir-turma'
            icon={<BsFillTrashFill />}
            // onClick={() => props.handleEditButton(row.original)}
          />
        </Tooltip>
      </HStack>
    ),
  },
];
