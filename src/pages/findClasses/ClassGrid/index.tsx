import { Alert, AlertIcon, SimpleGrid } from '@chakra-ui/react';
import { ClassResponse } from '../../../models/http/responses/class.response.models';
import ClassCard from '../ClassCard';

interface ClassGridProps {
  classes: ClassResponse[];
  columns?: number;
}

function ClassGrid({ classes, columns = 3 }: ClassGridProps) {
  return (
    <SimpleGrid columns={columns} spacing={'20px'}>
      {classes.map((cls) => (
        <ClassCard key={cls.id} cls={cls} />
      ))}
      {classes.length === 0 && (
        <Alert status='warning' borderRadius={'10px'} w={'fit-content'}>
          <AlertIcon />
          Nenhum oferecimento encontrado para essa disciplina
        </Alert>
      )}
    </SimpleGrid>
  );
}

export default ClassGrid;
