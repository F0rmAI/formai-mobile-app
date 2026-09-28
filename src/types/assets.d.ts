/** Metro/Uniwind procesa los CSS; solo se importan por efecto (global.css). */
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
