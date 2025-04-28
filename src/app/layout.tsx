"use client"
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import '../styles/globals.css';
import Header from "@/components/organisms/Header";
import Menu from "@/components/organisms/Menu";
import { Providers } from "@/app/Providers";
import Footer from "@/components/organisms/Footer";
import { ToastContainer } from "react-toastify";


const roboto = Roboto({
  subsets: ["vietnamese"],
  variable: "--font-roboto",
  display: "swap",
  weight: ["400", "500", "700"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="mdl-js">
      <body className={roboto.className}>
        <Providers>
          <Header />
          <Menu />
          {children}
          <Footer />
          <ToastContainer />
        </Providers>
      </body>
    </html>
  );
}
