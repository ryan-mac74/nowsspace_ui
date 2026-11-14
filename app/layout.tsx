import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { APP_TITLE, APP_DESCRIPTION } from "./core/config";
import ThemeProvider from "./context/theme";
import { themeInitScript } from "./context/themeScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_TITLE,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply saved / OS theme before first paint to avoid a flash */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">
        <ThemeProvider>
          {/* Render Children */}
          {children}
        </ThemeProvider>

        {/* Render Sonner Toast Notifications */}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
