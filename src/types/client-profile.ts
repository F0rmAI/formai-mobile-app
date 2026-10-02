/**
 * Authenticated client profile type.
 *
 * @author Carlos
 * @packageDocumentation
 */

/** Describes the signed-in client profile returned by the backend. */
export interface ClientProfile {
  /** Stable client identifier. */
  id: string;
  /** Full name registered by the trainer. */
  fullName: string;
  /** Email chosen when the account was activated. */
  email: string;
}
