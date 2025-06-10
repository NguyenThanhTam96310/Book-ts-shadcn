// src/app/layout.tsx
import { Roboto } from "next/font/google";
import '../styles/globals.css';
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import { ToastContainer } from "react-toastify";
import PageTransition from "@/components/atoms/PageTransition";
// Component mới cho chuyển trang

const roboto = Roboto({
  subsets: ["vietnamese"],
  variable: "--font-roboto",
  display: "swap",
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="mdl-js">
      <head>
      </head>
      <body className={`${roboto.className} flex flex-col min-h-[830px]`}>
        <Header />
        <main className="flex-grow">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
        <ToastContainer autoClose={3000} hideProgressBar />
      </body>
    </html>
  );
}