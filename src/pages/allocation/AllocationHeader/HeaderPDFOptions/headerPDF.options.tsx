import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  StackDivider,
  Text,
} from '@chakra-ui/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ClassesPDF from '../../pdf/ClassesPDF/classesPDF';
import ClassroomsPDF from '../../pdf/ClassroomsPDF/classroomsPDF';
import Select from 'react-select';
import { useState } from 'react';
import useClasses from 'hooks/useClasses';

type Option = {
  value: string;
  label: string;
};
interface PDFOptionsProps {
  buildings: Option[];
}

function HeaderPDFOptions({ buildings }: PDFOptionsProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<Option | null>(null);
  const { loading, classes, getClassesByBuildingName } = useClasses(false);

  return (
    <Popover placement='bottom-end'>
      <PopoverTrigger>
        <Button rightIcon={<ChevronDownIcon />} colorScheme='blue'>
          Baixar
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverCloseButton />
        <PopoverHeader>Baixe alocações e relatórios</PopoverHeader>
        <Stack
          direction={'column'}
          align={'flex-start'}
          justify={'center'}
          p={'5px'}
          divider={<StackDivider />}
          mb={'10px'}
        >
          <Box w={'full'}>
            <Select
              placeholder={'Selecione um prédio'}
              options={buildings}
              isClearable={true}
              onChange={(option: Option | null) => {
                setSelectedBuilding(option);
                if (option) getClassesByBuildingName(option.label);
              }}
            />
            {!selectedBuilding && (
              <Text color={'red.500'} ml={'5px'} mt={'5px'}>
                Selecione um prédio antes!
              </Text>
            )}
          </Box>

          <Heading size={'md'} ml={'5px'}>
            Alocações
          </Heading>

          <Box w={'full'}>
            <PDFDownloadLink
              document={<ClassesPDF classes={classes} />}
              fileName='disciplinas.pdf'
            >
              <Button
                w={'full'}
                isLoading={loading}
                disabled={!selectedBuilding}
                variant={'outline'}
                textColor={'uspolis.blue'}
              >
                Baixar alocação das disciplinas
              </Button>
            </PDFDownloadLink>
          </Box>

          <Box w={'full'}>
            <PDFDownloadLink
              document={<ClassroomsPDF classes={classes} reservations={[]} />}
              fileName='salas.pdf'
            >
              <Button
                w={'full'}
                isLoading={loading}
                disabled={!selectedBuilding}
                variant={'outline'}
                textColor={'uspolis.blue'}
              >
                Baixar alocação das salas
              </Button>
            </PDFDownloadLink>
          </Box>
        </Stack>
      </PopoverContent>
    </Popover>
  );
}

export default HeaderPDFOptions;
