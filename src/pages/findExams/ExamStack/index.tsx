import { Alert, AlertIcon, Flex } from '@chakra-ui/react';
import ExamCard from '../ExamCard';
import { ExamResponse } from '../../../models/http/responses/exam.response.models';

interface ExamStackProps {
  exams: ExamResponse[];
}

function ExamStack({ exams }: ExamStackProps) {
  return (
    <Flex direction={'column'} gap={'20px'}>
      {exams.map((exam) => (
        <ExamCard key={exam.id} exam={exam} />
      ))}
      {exams.length === 0 && (
        <Alert status='warning' borderRadius={'10px'} w={'fit-content'}>
          <AlertIcon />
          Nenhum oferecimento encontrado para essa disciplina
        </Alert>
      )}
    </Flex>
  );
}

export default ExamStack;
