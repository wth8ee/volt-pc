import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru;
  connect-src 'self' wss://mc.yandex.ru https://mc.yandex.ru;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://mc.yandex.ru;
`;

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
