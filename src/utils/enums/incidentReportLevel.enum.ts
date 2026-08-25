/* eslint-disable @typescript-eslint/no-namespace */
export enum IncidentReportLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export namespace IncidentReportLevel {
  export function values(): IncidentReportLevel[] {
    return [
      IncidentReportLevel.LOW,
      IncidentReportLevel.MEDIUM,
      IncidentReportLevel.HIGH,
      IncidentReportLevel.CRITICAL,
    ];
  }

  const translations: Record<IncidentReportLevel, string> = {
    [IncidentReportLevel.LOW]: 'Baixa',
    [IncidentReportLevel.MEDIUM]: 'Média',
    [IncidentReportLevel.HIGH]: 'Alta',
    [IncidentReportLevel.CRITICAL]: 'Crítica',
  };

  export function translate(level: IncidentReportLevel): string {
    return translations[level] || level;
  }

  const colorSchemes: Record<IncidentReportLevel, string> = {
    [IncidentReportLevel.LOW]: 'gray',
    [IncidentReportLevel.MEDIUM]: 'yellow',
    [IncidentReportLevel.HIGH]: 'orange',
    [IncidentReportLevel.CRITICAL]: 'red',
  };

  export function getColorScheme(level: IncidentReportLevel): string {
    return colorSchemes[level] || 'gray';
  }
}
