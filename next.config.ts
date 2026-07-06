import type { NextConfig } from "next";

const cspDirectives = [
  "default-src 'self';",

  // Скрипты
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru https://yookassa.ru https://yookassa.ru;",

  // Соединения (Разбито на удобные строки, чтобы всё было видно)
  "connect-src 'self'",
  "wss://mc.yandex.ru", // Вот он, протокол для веб-сокетов Яндекса!
  "https://mc.yandex.ru",
  "https://*.yandex.ru https://*.yandex.az https://*.yandex.by https://*.yandex.co.il https://*.yandex.com",
  "https://*.yandex.com.am https://*.yandex.com.ge https://*.yandex.com.tr https://*.yandex.ee https://*.yandex.fr",
  "https://*.yandex.kg https://*.yandex.kz https://*.yandex.lt https://*.yandex.lv https://*.yandex.md",
  "https://*.yandex.tj https://*.yandex.tm https://*.yandex.uz",
  "https://*.sberbank.ru https://*.nspk.ru https://*.yoomoney.ru https://*.yoomoney.ru:*",
  "https://127.0.0.1:* https://api.bonuscake.ru https://yookassa.ru https://yookassa.ru;", // Точка с запятой в конце!

  // Стили ЮKassa
  "style-src 'self' 'unsafe-inline' https://yookassa.ru https://yookassa.ru;",

  // Изображения
  "img-src 'self' blob: data: https://mc.yandex.ru https://yookassa.ru https://yookassa.ru;",

  // Фреймы для 3D-Secure и окон оплаты
  "frame-src 'self' https://yookassa.ru https://*.sberbank.ru;",
];

// Объединяем через пробел
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
