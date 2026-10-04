/**
 * Account activation resource types.
 *
 * @author Carlos
 * @packageDocumentation
 */

/** Describes the verified activation code before it expires. */
export interface ActivationCodeVerification {
  /** Expiration timestamp returned by the backend. */
  expiresAt: string;
}

/** Data submitted to activate or transfer a client account. */
export interface ActivateAccountInput {
  /** Code provided by the trainer. */
  activationCode: string;
  /** Email the client will use for subsequent sign-ins. */
  email: string;
  /** New or existing account password. */
  password: string;
  /** Whether the client accepted the data consent. */
  consentAccepted: boolean;
  /** Version of the consent text shown to the client. */
  consentVersion: string;
}

/** Describes an account after activation. */
export interface AccountActivation {
  /** Identifier of the activated account. */
  userId: string;
  /** Account lifecycle status after activation. */
  status: string;
  /** Activation timestamp returned by the backend. */
  activatedAt: string;
}
