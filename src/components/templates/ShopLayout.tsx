import Footer from "@/components/organisms/Footer";
import Header from "@/components/organisms/Header";
import Menu from "@/components/organisms/Menu";


export default function ShopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="mdl-js">
            <body >

                <Header />
                <Menu />
                {children}
                <Footer />


            </body>
        </html>
    );
}
