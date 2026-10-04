/**
 * Module declarations for the assets imported from source files.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

// Metro processes CSS through the styling binding; it is imported only for its side effect.
declare module '*.css';

declare module '*.png' {
  const source: number;
  export default source;
}

declare module '*.jpg' {
  const source: number;
  export default source;
}

declare module '*.jpeg' {
  const source: number;
  export default source;
}
