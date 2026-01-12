import Navbar from "@/components/layout/Navbar";
import SocketInitializer from "@/components/providers/SocketInitializer";
import "@/styles/globals.css";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dadaba National | Festival de Saveurs",
  description:
    "Découvrez nos plats d'exception pour un festival culinaire inoubliable.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <SocketInitializer />
        <Navbar />
        <Toaster
          position="top-right"
          toastOptions={{
            className: "font-bold rounded-2xl",
            duration: 4000,
            style: {
              background: "#0f172a",
              color: "#fff",
            },
          }}
        />
        <div className="flex flex-col min-h-screen">{children}</div>
      </body>
    </html>
  );
}
