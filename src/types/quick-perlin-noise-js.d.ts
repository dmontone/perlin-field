declare module 'quick-perlin-noise-js' {
  /**
   * Creates a new noise function.
   *
   * @param tableOrRng - A function that generates random numbers or an array of 256 integers for the permutation table.
   * @returns A noise function.
   */
  export function create(tableOrRng?: (() => number) | number[]): NoiseFunction;

  /**
   * Generates Perlin noise value for the given coordinates.
   *
   * @param x - The x coordinate.
   * @param y - The y coordinate.
   * @param z - The z coordinate.
   * @param xWrap - The wrapping value for x (optional).
   * @param yWrap - The wrapping value for y (optional).
   * @param zWrap - The wrapping value for z (optional).
   * @returns The noise value.
   */
  export function noise(x: number, y: number, z: number, xWrap?: number, yWrap?: number, zWrap?: number): number;

  /**
   * The noise function type returned by `create`.
   */
  export type NoiseFunction = (x: number, y: number, z: number, xWrap?: number, yWrap?: number, zWrap?: number) => number;
}