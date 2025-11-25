/* eslint-disable @typescript-eslint/no-namespace */
export enum BugPriority {
  LOW = 'low',
  AVERAGE = 'average',
  HIGH = 'high',
  URGENT = 'urgent',
}

export namespace BugPriority {
  const translations: { [key in BugPriority]: string } = {
    [BugPriority.LOW]: 'Baixa',
    [BugPriority.AVERAGE]: 'Média',
    [BugPriority.HIGH]: 'Alta',
    [BugPriority.URGENT]: 'Urgente',
  };

  const colorsMap: { [key in BugPriority]: string } = {
    [BugPriority.LOW]: 'uspolis.gray',
    [BugPriority.AVERAGE]: 'uspolis.blue',
    [BugPriority.HIGH]: 'uspolis.yellow',
    [BugPriority.URGENT]: 'uspolis.red',
  };

  const intMap: { [key in BugPriority]: number } = {
    [BugPriority.LOW]: 1,
    [BugPriority.AVERAGE]: 2,
    [BugPriority.HIGH]: 3,
    [BugPriority.URGENT]: 4,
  };

  export function translate(type: BugPriority): string {
    return translations[type];
  }

  export function values(): BugPriority[] {
    return Object.values(BugPriority).filter(
      (value) => typeof value === 'string',
    ) as BugPriority[];
  }

  export function getColor(value: BugPriority): string {
    return colorsMap[value] || 'uspolis.text';
  }

  export function toInt(value: BugPriority): number {
    return intMap[value] || 0;
  }
}

export enum BugType {
  FUNCTIONALITY = 'functionality',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  CRASH_ERROR = 'crash_error',
  UI = 'ui',
  OTHER = 'other',
}

export namespace BugType {
  const translations: { [key in BugType]: string } = {
    [BugType.FUNCTIONALITY]: 'Funcionalidade',
    [BugType.PERFORMANCE]: 'Desempenho',
    [BugType.SECURITY]: 'Segurança',
    [BugType.CRASH_ERROR]: 'Erro inesperado',
    [BugType.UI]: 'Interface/Tela',
    [BugType.OTHER]: 'Outro',
  };

  export function translate(type: BugType): string {
    return translations[type];
  }

  export function values(): BugType[] {
    return Object.values(BugType).filter(
      (value) => typeof value === 'string',
    ) as BugType[];
  }
}

export enum BugStatus {
  PENDING = 'pending',
  RESOLVED = 'resolved',
  IN_PROGRESS = 'in_progress',
  SKIPPED = 'skipped',
}

export namespace BugStatus {
  const translations: { [key in BugStatus]: string } = {
    [BugStatus.PENDING]: 'Pendente',
    [BugStatus.RESOLVED]: 'Resolvido',
    [BugStatus.IN_PROGRESS]: 'Em progresso',
    [BugStatus.SKIPPED]: 'Pulado',
  };

  export function translate(type: BugStatus): string {
    return translations[type];
  }

  export function values(): BugStatus[] {
    return [
      BugStatus.PENDING,
      BugStatus.IN_PROGRESS,
      BugStatus.RESOLVED,
      BugStatus.SKIPPED,
    ];
  }
}
