/**
 * Display name formatter.
 *
 * @author Carlos
 * @packageDocumentation
 */

/**
 * Returns the first name from a full name for the greeting.
 *
 * @param fullName - Name supplied by the client profile.
 * @returns The first nonempty name segment, or an empty string.
 *
 * @example
 * ```ts
 * firstNameOf('Diego Paredes'); // 'Diego'
 * ```
 */
export const firstNameOf = (fullName: string) =>
  fullName.trim().split(/\s+/)[0] ?? '';
