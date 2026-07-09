import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const cspRules = [
    "default-src 'self';",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' https://yookassa.ru https://*.yoomoney.ru https://*.yandex.ru https://mc.yandex.ru ${process.env.NODE_ENV === "development" ? "'unsafe-eval'" : ""};`,
    "style-src 'self' 'unsafe-inline' https://yookassa.ru;",
    "connect-src 'self' https://yookassa.ru https://*.yoomoney.ru https://*.sberbank.ru https://*.yandex.ru wss://*.yoomoney.ru wss://*.sberbank.ru wss://*.yandex.ru wss://mc.yandex.ru wss://mc.yandex.ru/solid.ws;",
    "frame-src 'self' https://yookassa.ru https://*.yoomoney.ru https://*.sberbank.ru https://*.paymentgate.ru https://*.yandex.ru wss://*.yandex.ru wss://mc.yandex.ru wss://mc.yandex.ru/solid.ws;",
    "child-src 'self' https://yookassa.ru https://*.yoomoney.ru https://*.yandex.ru;",

    "worker-src 'self' blob: https://*.yandex.ru https://mc.yandex.ru ;",

    "img-src 'self' blob: data: https://yookassa.ru https://*.yoomoney.ru https://*.sberbank.ru https://*.yandex.ru;",
    "font-src 'self';",
    "object-src 'none';",
    "base-uri 'self';",
    "form-action 'self' https://yookassa.ru https://*.yoomoney.ru;",
    "frame-ancestors 'none';",
    "upgrade-insecure-requests;",
  ];

  const cspHeader = cspRules.join(" ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
