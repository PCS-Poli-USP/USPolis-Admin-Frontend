import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ClassesPDF from '../../pdf/ClassesPDF/classesPDF';
import ClassroomsPDF from '../../pdf/ClassroomsPDF/classroomsPDF';

function HeaderPDFOptions() {
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        colorScheme='blue'
      >
        Baixar
      </MenuButton>
      <MenuList zIndex={99999}>
        <MenuItem>
          <PDFDownloadLink
            document={<ClassesPDF classes={[]} />}
            fileName='disciplinas.pdf'
          >
            {/* {(params) =>
              params.loading
                ? 'Carregando PDF...'
                : 'Baixar alocação das disciplinas'
            } */}
          </PDFDownloadLink>
        </MenuItem>
        <MenuItem>
          <PDFDownloadLink
            document={<ClassroomsPDF classes={[]} reservations={[]} />}
            fileName='salas.pdf'
          >
            {/* {(params) =>
              params.loading ? 'Carregando PDF...' : 'Baixar alocação das salas'
            } */}
          </PDFDownloadLink>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default HeaderPDFOptions;
