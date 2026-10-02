/**
 * Mail provider inbox URL selection.
 *
 * @author Carlos
 * @packageDocumentation
 */

interface MailProvider {
  /** Email domains handled by this provider. */
  domains: string[];
  /** Provider app URL scheme on iOS. */
  iosApp?: string;
  /** Provider web inbox. */
  web: string;
}

const MAIL_PROVIDERS: MailProvider[] = [
  {
    domains: ['gmail.com', 'googlemail.com'],
    iosApp: 'googlegmail://',
    web: 'https://mail.google.com/',
  },
  {
    domains: [
      'outlook.com',
      'outlook.es',
      'hotmail.com',
      'live.com',
      'msn.com',
    ],
    iosApp: 'ms-outlook://',
    web: 'https://outlook.live.com/mail/',
  },
  {
    domains: ['yahoo.com', 'yahoo.es', 'ymail.com'],
    iosApp: 'ymail://',
    web: 'https://mail.yahoo.com/',
  },
  {
    domains: ['icloud.com', 'me.com', 'mac.com'],
    web: 'https://www.icloud.com/mail/',
  },
];

/**
 * Lists available inbox destinations from most direct to least direct.
 *
 * @remarks
 * Tries the provider app, device mail app and provider website. No URL includes the client email address.
 *
 * @param email - Address used only to identify the mail provider.
 * @param platform - React Native platform identifier.
 * @returns Inbox URLs in fallback order.
 *
 * @example
 * ```ts
 * mailInboxUrls('user@gmail.com', 'android'); // ['https://mail.google.com/', 'mailto:']
 * ```
 */
export function mailInboxUrls(email: string, platform: string) {
  const domain = email.trim().toLowerCase().split('@')[1];
  const provider = MAIL_PROVIDERS.find(({ domains }) =>
    domains.includes(domain),
  );

  // Android has no inbox URL; `mailto:` starts a new message.
  const urls =
    platform === 'ios'
      ? [provider?.iosApp, 'message://', provider?.web]
      : [provider?.web, 'mailto:'];

  return urls.filter((url): url is string => Boolean(url));
}
