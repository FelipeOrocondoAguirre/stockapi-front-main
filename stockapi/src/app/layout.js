import "./globals.css";
import Footer from "../components/Footer";

export const metadata = {
  title: "Stockapi | Controle de estoque",
  description: "Sistema de controle de estoque e pedidos"
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
