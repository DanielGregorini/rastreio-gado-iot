import type { Metadata } from "next";

import Navbar from "@/components/ui/navbar"; 
import Footer from "@/components/ui/footer";
import "./globals.css"

export const metadata: Metadata = {
  title: "Gado Rastreio App",
  description: "by: palhaços loucos"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
