import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Cart from "@/components/Cart";

// Optimisation des polices avec préchargement et fallback système
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pâtisserie - Saveurs Artisanales",
  description: "Découvrez nos pâtisseries artisanales préparées avec passion et des ingrédients de qualité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${playfair.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <CartProvider>
          {children}
          <Cart />
        </CartProvider>
      </body>
    </html>
  );
}
