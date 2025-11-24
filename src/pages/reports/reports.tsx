import { useEffect, useState, useMemo, useContext } from 'react';
import {
  Flex,
  Text,
  Skeleton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Divider,
  Grid,
} from '@chakra-ui/react';
import Select from 'react-select';
import PageContent from '../../components/common/PageContent';
import useCustomToast from '../../hooks/useCustomToast';
import useBuildingsService from '../../hooks/API/services/useBuildingsService';
import useOccupanceReportsService from '../../hooks/API/services/useOccupanceReportsService';
import { BuildingResponse } from '../../models/http/responses/building.response.models';
import OccupanceReports from '../../models/http/responses/occupanceReports.response.models';
import { appContext } from '../../context/AppContext';
import { WeekDay } from '../../utils/enums/weekDays.enum';

type Option = {
  value: number;
  label: string;
};

type filter_options = | "all" | "super" | "0-25" | "25-50" | "50-80" | "80-100" | "sub";

const FILTER_OPTIONS = [
  { value: "all", label: "Todas" },
  { value: "super", label: "Superlotações (>100%)" },
  { value: "0-25", label: "Sublotações de 0 a 25%" },
  { value: "25-50", label: "Ocupação de 25 a 50%" },
  { value: "50-80", label: "Ocupação de 50 a 80%" },
  { value: "80-100", label: "Ocupação de 80 a 100%" },  
  { value: "sub", label: "Todas as sublotações (≤100%)" }
];

const getPercentageColor = (value: number) => {
  if (value > 100) return "red.500";
  if (value > 80) return "orange.500";
  if (value > 50) return "green.500";
  if (value > 25) return "orange.500";
  if (value > 0) return "red.500";
  return "gray.700";
};

const ReportsPage = () => {
  const showToast = useCustomToast();
  const buildingsService = useBuildingsService();
  const occupanceReportsService = useOccupanceReportsService();
  const {loggedUser} = useContext(appContext);
  const userBuildingIds = loggedUser && loggedUser.buildings ? loggedUser.buildings.map((building) => building.id) : []; 

  const initialBuildingId = (() => {
    if (!loggedUser) return null;
    if (loggedUser.is_admin) return null;

    const buildings = loggedUser.buildings || [];

    if (buildings.length === 1) {
      return buildings[0].id;
    }

    return null;// nenhum prédio ou mais de um prédio
  })();
  
  const [buildings, setBuildings] = useState<BuildingResponse[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(initialBuildingId);
  const [reports, setReports] = useState<OccupanceReports[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<filter_options>("all");

  //carrega os buildings (uma vez no início)
  useEffect(() => {
    buildingsService.getAll()
      .then((res) => { //res → response (função a ser executada quando a resposta chegar)
        setBuildings(res.data); //salva em buildig os dados retornados no backend
      })
      .catch(() => showToast('Erro', 'Erro ao carregar prédios', 'error'));
  }, []);

  //pega as alocações
  async function fetchReports() {
    if (!selectedBuildingId) return;

    setLoading(true);

    await occupanceReportsService
      .listByBuilding(selectedBuildingId)
      .then((res) => setReports(res.data))
      .catch(() => showToast('Erro', 'Erro ao carregar as alocações', 'error'))
      .finally(() => setLoading(false));
  }

  // pega as alocações cada vez que o building ou o filtro mudam
  useEffect(() => {
    if (selectedBuildingId) fetchReports();
  }, [selectedBuildingId, filterMode]);

  //filtra as alocações a partir dos filtros
  const filteredReports = useMemo(() => { //armazena o resultado dessa função para que ela não precise ser chamada repetidamente
    if (!reports) return [];

    return reports.filter((c) => {
      if (filterMode === "sub") return c.percentage <= 100;
      if (filterMode === "super") return c.percentage > 100;
      if (filterMode === "0-25") return c.percentage > 0 && c.percentage <= 25;
      if (filterMode === "25-50") return c.percentage > 25 && c.percentage <= 50;
      if (filterMode === "50-80") return c.percentage > 50 && c.percentage <= 80;
      if (filterMode === "80-100") return c.percentage > 80 && c.percentage <= 100;
      return true; //"all"
    });
  }, [reports, filterMode]);

  //alocações já filtradas agrupadas por classroom
  const groupedReports = useMemo(() => {
    const sorted = [...filteredReports].sort((a, b) => { //....cria uma cópia de filteredReports (protege o array original)
      if (a.week_day !== b.week_day) return a.week_day - b.week_day; //<0 → ordem a,b; > 0 → ordem b,a
      return a.start_time.localeCompare(b.start_time);
    });//retorna uma lista ordenada por dia e horário

    return sorted.reduce((acc, report) => { //acc serve como mapa, classroom a chave e alocações são os valores/objetos
      if (!acc[report.classroom]) acc[report.classroom] = []; 
      acc[report.classroom].push(report);
      return acc;
    }, {} as Record<string, OccupanceReports[]>);
  }, [filteredReports]);

  return (
    <PageContent>
      <Flex paddingX={4} direction="column">
        <Text fontSize="4xl" mb={4}>Relatório de Taxa de Ocupação</Text>
        <Flex direction="row" gap={4} mb={4}>
          <Flex direction="column" flex={1}>
            <Text fontSize="md">Prédio:</Text>
            <Select
              placeholder="Selecione o prédio"
              options={buildings.filter((value) => userBuildingIds.includes(value.id)).map((b) => ({
                label: b.name,
                value: b.id,
              }))}
              value={
                selectedBuildingId
                  ? {
                      label: buildings.find(b => b.id === selectedBuildingId)?.name ?? '', //se for null ou undefined → ''
                      value: selectedBuildingId
                    }
                  : null
              }
              onChange={(option: Option | null) =>
                setSelectedBuildingId(option ? option.value : null)
              }
            />
          </Flex>

          <Flex direction="column" flex={1}>
            <Text fontSize="md">Filtro:</Text>
            <Select
              options={FILTER_OPTIONS}
              value={FILTER_OPTIONS.find(f => f.value === filterMode)}
              onChange={(option) =>
                setFilterMode(option?.value as "all" | "super" | "0-25" | "25-50" | "50-80" | "80-100" | "sub")}
            />
          </Flex>
        </Flex>

        <Skeleton isLoaded={!loading}> {/*exibe um loading enquanto os dados ainda não carregaram*/}
          {filteredReports.length > 0 ? (
            <Accordion allowMultiple>
              {Object.entries(groupedReports)
                .sort(([, a], [, b]) => {
                  const maxA = Math.max(...a.map(c => c.percentage));
                  const maxB = Math.max(...b.map(c => c.percentage));
                  return maxB - maxA;
                })
                .map(([classroom, list]) => {
                  const maxPercentage = Math.max(...list.map(c => c.percentage));

                  return (
                    <AccordionItem key={classroom} borderWidth="1px" borderRadius="md" mb={3}>
                      <h2>
                        <AccordionButton _expanded={{ bg: 'blue.50' }}>
                          <Flex w="100%" align="center">
                            <Box flex="1" textAlign="left" fontWeight="bold" fontSize="lg">
                              {classroom} ({list.length} alocaç{list.length > 1 ? 'ões' : 'ão'})
                            </Box>

                            <Text
                              fontWeight="semibold"
                              mr={3}
                              color={getPercentageColor(maxPercentage)}
                            >
                              {maxPercentage.toFixed(2)}%
                            </Text>

                            <AccordionIcon />
                          </Flex>
                        </AccordionButton>
                      </h2>

                      <AccordionPanel pb={4}>
                        {list.map((c, idx) => (
                          <Box key={idx} mb={3}>
                            <Grid templateColumns="1fr auto" alignItems="center" gap={2}>
                              <Box>
                                <Text fontWeight="semibold">
                                  {WeekDay.translate(c.week_day)} | {c.start_time} - {c.end_time}
                                </Text>
                                <Text>Capacidade: {c.capacity}</Text>
                                <Text>Alunos alocados: {c.students}</Text>
                                <Text>Turmas: {c.classes.join(', ')}</Text>
                              </Box>

                              <Text
                                fontWeight="bold"
                                color={getPercentageColor(c.percentage)}
                                textAlign="right"
                                minW="70px"
                              >
                                {c.percentage.toFixed(2)}%
                              </Text>
                            </Grid>

                            {idx < list.length - 1 && <Divider my={2} />}
                          </Box>
                        ))}
                      </AccordionPanel>

                    </AccordionItem>
                  );
                })}
            </Accordion>
          ) : (
            !loading && <Text color="gray.500">Nenhuma alocação encontrada.</Text>
          )}
        </Skeleton>
      </Flex>
    </PageContent>
  );
};

export default ReportsPage;