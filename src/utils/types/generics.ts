export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

export type XORN<T extends unknown[]> = T extends [infer Only]
  ? Only
  : T extends [infer F, infer S, ...infer R]
    ? XOR<F, XORN<[S, ...R]>>
    : never;

export default MakeOptional;
