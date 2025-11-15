/* eslint-disable @typescript-eslint/no-namespace */
export enum AudiovisualType {
  PROJECTOR = 'projector',
  TV = 'tv',
  NONE = 'none',
}

export namespace AudiovisualType {
  const translations: { [key in AudiovisualType]: string } = {
    [AudiovisualType.PROJECTOR]: 'Projetor',
    [AudiovisualType.TV]: 'TV',
    [AudiovisualType.NONE]: 'Nenhum',
  };

  export function translate(type: AudiovisualType): string {
    return translations[type];
  }
  
  export function values(): AudiovisualType[] {
    return Object.values(AudiovisualType).filter(
      (value) => typeof value === 'string',
    ) as AudiovisualType[];
  }
}
