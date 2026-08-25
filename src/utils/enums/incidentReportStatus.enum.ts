/* eslint-disable @typescript-eslint/no-namespace */
export enum IncidentReportStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
}

export namespace IncidentReportStatus {
  export function values(): IncidentReportStatus[] {
    return [
      IncidentReportStatus.OPEN,
      IncidentReportStatus.INVESTIGATING,
      IncidentReportStatus.RESOLVED,
    ];
  }

  const translations: Record<IncidentReportStatus, string> = {
    [IncidentReportStatus.OPEN]: 'Aberto',
    [IncidentReportStatus.INVESTIGATING]: 'Investigando',
    [IncidentReportStatus.RESOLVED]: 'Resolvido',
  };

  export function translate(status: IncidentReportStatus): string {
    return translations[status] || status;
  }

  const colorSchemes: Record<IncidentReportStatus, string> = {
    [IncidentReportStatus.OPEN]: 'red',
    [IncidentReportStatus.INVESTIGATING]: 'yellow',
    [IncidentReportStatus.RESOLVED]: 'green',
  };

  export function getColorScheme(status: IncidentReportStatus): string {
    return colorSchemes[status] || 'gray';
  }
}
