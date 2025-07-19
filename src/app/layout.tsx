import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClimaCast - Previsão do Tempo",
  description: "Previsão do tempo detalhada para qualquer cidade, com dados atualizados e interface moderna.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}