
import { Roboto } from "next/font/google";
import '../styles/globals.css';
import Header from "@/components/organisms/Header";
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
}: {
  children: React.ReactNode;

}) {
  return (
    <html lang="en" className="mdl-js">
      <body className={`${roboto.className} flex flex-col min-h-[830px]`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
