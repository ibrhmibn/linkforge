// app/layout.jsx
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const body = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: {
    default: "LinkForge",
    template: "%s // LinkForge",
  },
  description:
    "Tempa halaman link-in-bio kamu dengan gaya arcade 80s-90s. Drag & drop, aesthetic 8-bit, super cepat.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "LinkForge — Link-in-Bio ala Arcade",
    description:
      "Tempa halaman link-in-bio kamu dengan gaya arcade 80s-90s.",
    url: "/",
    siteName: "LinkForge",
    images: [
      {
        url: "/og-default.png", // nanti kita bikin
        width: 1200,
        height: 630,
        alt: "LinkForge — Insert Coin",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkForge — Link-in-Bio ala Arcade",
    description:
      "Tempa halaman link-in-bio kamu dengan gaya arcade 80s-90s.",
    images: ["/og-default.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${pixel.variable} ${body.variable}`}>
      <body>
        {children}
        <div className="scanlines" aria-hidden="true" />
      </body>
    </html>
  );
}