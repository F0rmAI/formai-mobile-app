/**
 * Build-time environment variables provided by the Babel plugin.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

declare module '@env' {
  /** Optional API base URL for the selected build target. */
  export const API_URL: string | undefined;
}
