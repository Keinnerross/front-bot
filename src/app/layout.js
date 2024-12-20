
import localFont from "next/font/local";
import { Poppins } from 'next/font/google';
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

export const metadata = {
  title: "Fresata Dashboard Admin",
  description: "Administra los pedidos de whatsapp",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es"  className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}>
      <body className="font-poppins">
        {children}
      </body>
    </html>
  );
}
