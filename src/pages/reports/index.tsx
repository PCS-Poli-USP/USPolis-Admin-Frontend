import { Text, useColorMode, useDisclosure } from '@chakra-ui/react';
import PageContent from '../../components/common/PageContent';
import useBugReports from '../../hooks/bugReports/useBugReports';
import { useEffect, useState } from 'react';
import DataTable from '../../components/common/DataTable/dataTable.component';
import { getBugReportsColumns } from './Tables/reports.table';
import { BugReportResponse } from '../../models/http/responses/bugReport.response.models';
import EvidenceModal from './EvidenceModal';
import BugReportModal from './BugReportModal';
import BugDescriptionModal from './BugDescriptionModal';

function Reports() {
  const { colorMode } = useColorMode();
  const { loading, reports, getReports } = useBugReports();

  const {
    isOpen: isOpenDescription,
    onClose: onCloseDescription,
    onOpen: onOpenDescription,
  } = useDisclosure();
  const {
    isOpen: isOpenModal,
    onClose: onCloseModal,
    onOpen: onOpenModal,
  } = useDisclosure();
  const {
    isOpen: isOpenDescModal,
    onClose: onCloseDescModal,
    onOpen: onOpenDescModal,
  } = useDisclosure();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedReport, setSelectedReport] = useState<BugReportResponse>();

  useEffect(() => {
    getReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = getBugReportsColumns({
    handleViewClick: (data) => {
      setSelectedReport(data);
      onOpen();
    },
    handleUpdateClick: (data) => {
      setSelectedReport(data);
      onOpenModal();
    },
    handleDescriptionClick: (data) => {
      setSelectedReport(data);
      onOpenDescModal();
    },
    darkMode: colorMode == 'dark',
    isOpen: isOpenDescription,
    onClose: onCloseDescription,
    onOpen: onOpenDescription,
  });

  return (
    <PageContent>
      <Text fontSize='4xl' mb={4}>
        Reportes
      </Text>
      <DataTable
        loading={loading}
        columns={columns}
        data={reports}
        columnPinning={{
          left: ['id'],
          right: ['options'],
        }}
      />
      <BugDescriptionModal
        isOpen={isOpenDescModal}
        onClose={() => {
          onCloseDescModal();
          setSelectedReport(undefined);
        }}
        selectedBugResponse={selectedReport}
      />
      <EvidenceModal
        isOpen={isOpen}
        onClose={() => {
          setSelectedReport(undefined);
          onClose();
        }}
        selectedReport={selectedReport}
      />
      <BugReportModal
        isOpen={isOpenModal}
        onClose={onCloseModal}
        selectedReport={selectedReport}
        refetch={() => getReports()}
      />
    </PageContent>
  );
}

export default Reports;
