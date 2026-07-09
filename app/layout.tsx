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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentHeaders = await headers();

  const serverSession = await auth.api.getSession({
    headers: currentHeaders,
  });

  const nonce = currentHeaders.get("x-nonce") || undefined;

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
        {/* Теперь nonce гарантированно попадет в head без багов кэширования Vercel */}
        <head nonce={nonce} />
        <body className="min-h-full flex flex-col bg-white text-zinc-950">
          <Navbar />
          {children}
        </body>
      </html>
    </AuthProvider>
  );
}
