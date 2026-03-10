import {
  Box,
  Checkbox,
  Divider,
  Flex,
  IconButton,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import PageContent from "../../components/common/PageContent";
import TooltipSelect from '../../components/common/TooltipSelect';
import { AddIcon } from '@chakra-ui/icons';

const MOCK_COURSES = [
  { label: 'Engenharia de Computação', 
    value: 1, 
    versions: [
      '2020',
      '2022',
      '2023',
    ],},
  { label: 'Engenharia Civil',
    value: 2, 
    versions: [
      '2021',
      '2022',
      '2025',
    ],},
  { label: 'Engenharia Elétrica (ciclo básico)',
    value: 3,
    versions: [
      '2018',
      '2019',
      '2020',
    ], },
  { label: 'Engenharia Elétrica: Ênfase PSI',
    value: 4,
    versions: [
      '2023',
      '2024',
      '2026',
    ],},
];

const ENG_COMP = {
    minimal_duration: 8,
    maximal_duration: 18,
    ideal_duration: 10,
    period: "integral",
}

const ENG_COMP_CURRICULUM = {
    AAC: 60,
    AEX: 630,
    description: `Alunos ingressantes na EPUSP a partir de 2023: passa a existir somente 4 créditos-aula em optativas livres.
`,
}

const DISCIPLINAS = {
  "1º Período": [
    "Cálculo I",
    "Física I",
    "Introdução à Engenharia de Computação",
  ],
  "2º Período": [
    "Cálculo II",
    "Física II",
    "Algoritmos",
  ],
  "3º Período": [
    "Cálculo III",
    "Física III",
    "Laboratório de Programação Orientada à Objetos",
  ],
};

const periodOptions = [
  { label: "Todos os períodos", value: "ALL" },
  ...Object.keys(DISCIPLINAS).map((period) => ({
    label: period,
    value: period,
  })),
];

const CoursesPage = () => {
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const selectedCourse = MOCK_COURSES.find(
        course => course.value === selectedCourseId
    );
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
    const [selectedPeriods, setSelectedPeriods] = useState<string[]>(
        Object.keys(DISCIPLINAS)
    );
    const [isFixedCourse, setIsFixedCourse] = useState(false);
    const handleAddAllFromPeriod = (period: string) => {
    const disciplinas = DISCIPLINAS[period];
    console.log("Adicionar todas:", disciplinas);
    };

    return(
        <PageContent>
            <Flex paddingX={4} direction="column">
                <Text fontSize="4xl" mb={4}>Cursos</Text>
                    <Flex direction="row" gap={4} mb={4}>
                        <Flex direction='column' flex={1}>
                            <Text fontSize='md'>Cursos:</Text>
                            <TooltipSelect
                                placeholder='Selecione o curso'
                                options={MOCK_COURSES.map(course => ({
                                    label: course.label,
                                    value: course.value,
                                }))}
                            onChange={(option) =>
                                setSelectedCourseId(option ? (option.value as number) : null)
                            }
                            />
                        </Flex>
                
                        <Flex direction='column' flex={1}>
                            <Text fontSize='md'>Versões:</Text>
                            <TooltipSelect
                                placeholder="Selecione a versão"
                                options={
                                    selectedCourse
                                    ? selectedCourse.versions.map(version => ({
                                        label: version,
                                        value: version,
                                        }))
                                    : []
                                }
                                isDisabled={!selectedCourse}
                                onChange={(option) =>
                                    setSelectedVersion(option ? (option.value as string) : null)
                                }
                            />
                        </Flex>
                    </Flex>

                    <Skeleton isLoaded={!!(selectedCourseId && selectedVersion)}>
                        {/*depois arrumar o loading*/}
                        {selectedCourseId && selectedVersion && (
                            <Box mt={6} p={4} borderWidth="1px" borderRadius="md">
                                <Flex justify="space-between" align="center" mb={4}>
                                    <Text fontSize="2xl" fontWeight="bold">
                                        {selectedCourse?.label}
                                    </Text>

                                    <Checkbox
                                        isChecked={isFixedCourse}
                                        onChange={(e) => setIsFixedCourse(e.target.checked)}
                                    >
                                        Fixar como curso do aluno
                                    </Checkbox>
                                </Flex>

                                <Text mt={2} whiteSpace="pre-line">
                                    <Text as="span" fontWeight="bold">
                                        Descrição:
                                    </Text>{" "}
                                    {ENG_COMP_CURRICULUM.description}
                                </Text>

                                <Text mt={2}>
                                    <Text as="span" fontWeight="bold">
                                        Duração ideal: 
                                    </Text>{" "}
                                    {ENG_COMP.ideal_duration} semestres
                                </Text>
                                <Text mt={2}>
                                    <Text as="span" fontWeight="bold">
                                        Duração mínima: 
                                    </Text>{" "}
                                    {ENG_COMP.minimal_duration} semestres
                                </Text>
                                <Text mt={2}>
                                    <Text as="span" fontWeight="bold">
                                        Duração máxima: 
                                    </Text>{" "}
                                    {ENG_COMP.maximal_duration} semestres
                                </Text>
                                <Text mt={2}>
                                    <Text as="span" fontWeight="bold">
                                        AEX: 
                                    </Text>{" "}
                                    {ENG_COMP_CURRICULUM.AEX} horas
                                </Text>
                                <Text mt={2}>
                                    <Text as="span" fontWeight="bold">
                                        AAC: 
                                    </Text>{" "}
                                    {ENG_COMP_CURRICULUM.AAC} horas
                                </Text>
                                
                                <Box mt={6} p={6} borderWidth="1px" borderRadius="lg">
                                    <Flex justify="space-between" align="center">
                                        <Text fontSize="xl" fontWeight="bold">
                                        Disciplinas Obrigatórias
                                        </Text>

                                        <TooltipSelect
                                            placeholder="Selecione os períodos"
                                            isMulti
                                            options={periodOptions}
                                            onChange={(options) => {
                                                if (!options) {
                                                setSelectedPeriods([]);
                                                return;
                                                }

                                                const values = options.map((opt) => opt.value as string);

                                                if (values.includes("ALL")) {
                                                setSelectedPeriods(Object.keys(DISCIPLINAS));
                                                } else {
                                                setSelectedPeriods(values);
                                                }
                                            }}
                                            />


                                    </Flex>
                                        <Divider mt={4} />
                                {selectedPeriods.map((period) => (
                                    <Box key={period} mt={8}>
                                        <Divider mb={4} />

                                        <Flex justify="space-between" align="center" mb={3}>
                                        <Text fontSize="lg" fontWeight="bold">
                                            {period}
                                        </Text>

                                        <Tooltip label="Adicionar todas as disciplinas do período à grade">
                                            <IconButton
                                            size="sm"
                                            colorScheme="blue"
                                            variant="ghost"
                                            aria-label="adicionar-todas"
                                            icon={<AddIcon />}
                                            onClick={() => handleAddAllFromPeriod(period)}
                                            />
                                        </Tooltip>
                                        </Flex>

                                        <VStack align="stretch" spacing={2}>
                                        {DISCIPLINAS[period].map((materia) => (
                                            <Flex
                                            key={materia}
                                            justify="space-between"
                                            align="center"
                                            p={2}
                                            borderRadius="md"
                                            _hover={{ bg: "gray.50" }}
                                            >
                                            <Text>{materia}</Text>

                                            <Tooltip label="Adicionar disciplina à grade">
                                                <IconButton
                                                size="sm"
                                                colorScheme="green"
                                                variant="ghost"
                                                aria-label="adicionar-disciplina"
                                                icon={<AddIcon />}
                                                />
                                            </Tooltip>
                                            </Flex>
                                        ))}
                                        </VStack>

                                    </Box>
                                    ))}
                            </Box>
                            </Box>
                            )}
                    </Skeleton>
            </Flex>
        </PageContent>
    );
};

export default CoursesPage;