import type { NextConfig } from "next";

const cspDirectives = [
  "default-src 'self';",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru https://yookassa.ru https://yookassa.ru;",
  "connect-src 'self' wss://mc.yandex.ru https://mc.yandex.ru https://*.yandex.ru https://*.yandex.az https://*.yandex.by https://*.yandex.co.il https://*.yandex.com https://*.yandex.com.am https://*.yandex.com.ge https://*.yandex.com.tr https://*.yandex.ee https://*.yandex.fr https://*.yandex.kg https://*.yandex.kz https://*.yandex.lt https://*.yandex.lv https://*.yandex.md https://*.yandex.tj https://*.yandex.tm https://*.yandex.uz https://*.sberbank.ru https://*.nspk.ru https://*.yoomoney.ru https://*.yoomoney.ru:* https://127.0.0.1:* https://api.bonuscake.ru https://yookassa.ru https://yookassa.ru;",
  "style-src 'self' 'unsafe-inline' https://yookassa.ru https://yookassa.ru;",
  "img-src 'self' blob: data: https://mc.yandex.ru https://yookassa.ru https://yookassa.ru;",
  "frame-src 'self' https://yookassa.ru https://*.sberbank.ru;",
];

const cspHeader = cspDirectives.join(" ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
