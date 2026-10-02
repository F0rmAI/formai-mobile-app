interface MailProvider {
  domains: string[];
  /** Esquema de la app del proveedor en iOS. */
  iosApp?: string;
  /** Bandeja de entrada en la web. */
  web: string;
}

const MAIL_PROVIDERS: MailProvider[] = [
  {
    domains: ['gmail.com', 'googlemail.com'],
    iosApp: 'googlegmail://',
    web: 'https://mail.google.com/',
  },
  {
    domains: ['outlook.com', 'outlook.es', 'hotmail.com', 'live.com', 'msn.com'],
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
 * Dónde puede leer su correo el cliente, de la opción más directa a la menos: la app
 * de su proveedor, la app de correo del teléfono y la bandeja web del proveedor.
 * Ninguna URL lleva el correo del cliente.
 */
export function mailInboxUrls(email: string, platform: string) {
  const domain = email.trim().toLowerCase().split('@')[1];
  const provider = MAIL_PROVIDERS.find(({ domains }) =>
    domains.includes(domain),
  );

  // Android no tiene una URL que abra la bandeja: `mailto:` abre un mensaje nuevo.
  const urls =
    platform === 'ios'
      ? [provider?.iosApp, 'message://', provider?.web]
      : [provider?.web, 'mailto:'];

  return urls.filter((url): url is string => Boolean(url));
}
