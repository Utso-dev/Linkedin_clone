import ReduxProvider from "@/components/reusable/ReduxProvider";
import { AppConfig } from "@/config/app.config";
import type { Metadata } from "next";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// If loading a variable font, you don't need to specify the font weight
const segoeUi = localFont({
  src: "../public/font/Segoe UI.ttf",
});

export const metadata: Metadata = {
  title: "MindUnite",
  description: AppConfig().app.slogan,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${segoeUi.className}`}>
        <NextTopLoader
          color="#04a1b7"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #04a1b7,0 0 5px #04a1b7"
          zIndex={99999}
        />
        <Toaster />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}

