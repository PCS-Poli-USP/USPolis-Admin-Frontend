/* eslint-disable @typescript-eslint/no-namespace */
export enum PageSize {
  SIZE_5 = 5,
  SIZE_10 = 10,
  SIZE_20 = 20,
  SIZE_30 = 30,
  SIZE_40 = 40,
  SIZE_50 = 50,
}

export namespace PageSize {
  export function values() {
    return [
      PageSize.SIZE_5,
      PageSize.SIZE_10,
      PageSize.SIZE_20,
      PageSize.SIZE_30,
      PageSize.SIZE_40,
      PageSize.SIZE_50,
    ];
  }
}
