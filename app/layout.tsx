import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/context/AuthProvider";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoltPC — Магазин топовых комплектующих для ПК",
  description:
    "Видеокарты, процессоры и оперативная память от ASUS, NVIDIA, Intel и AMD по лучшим ценам.",
  other: {
    // Вставляем полную, рабочую и проверенную политику со всеми доступами
    "content-security-policy":
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://mc.yandex.ru https://yookassa.ru https://yookassa.ru; connect-src 'self' wss://mc.yandex.ru https://mc.yandex.ru https://*.yandex.ru https://*.yandex.az https://*.yandex.by https://*.yandex.co.il https://*.yandex.com https://*.yandex.com.am https://*.yandex.com.ge https://*.yandex.com.tr https://*.yandex.ee https://*.yandex.fr https://*.yandex.kg https://*.yandex.kz https://*.yandex.lt https://*.yandex.lv https://*.yandex.md https://*.yandex.tj https://*.yandex.tm https://*.yandex.uz https://*.sberbank.ru https://*.nspk.ru https://*.yoomoney.ru https://*.yoomoney.ru:* https://127.0.0.1:* https://api.bonuscake.ru https://yookassa.ru https://yookassa.ru; style-src 'self' 'unsafe-inline' https://yookassa.ru https://yookassa.ru; img-src 'self' blob: data: https://mc.yandex.ru https://yookassa.ru https://yookassa.ru; frame-src 'self' https://yookassa.ru https://*.sberbank.ru;",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const serverSession = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <AuthProvider initialSession={serverSession}>
      <html
        lang="en"
        className={cn(
          "h-full",
          "antialiased",
          geistSans.variable,
          geistMono.variable,
          "font-sans",
          inter.variable,
        )}
      >
        <body className="min-h-full flex flex-col bg-white text-zinc-950">
          <Navbar />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
