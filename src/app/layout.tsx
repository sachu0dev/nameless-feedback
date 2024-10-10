import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";

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

export const metadata: Metadata = {
  title: "Nameless",
  description: "Nameless - The feedback app for developers",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "https://res.cloudinary.com/dijtcmvrm/image/upload/f_auto,q_auto/zbx4waahb8y74n03wfcm",
        href: "https://res.cloudinary.com/dijtcmvrm/image/upload/f_auto,q_auto/zbx4waahb8y74n03wfcm",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "https://res.cloudinary.com/dijtcmvrm/image/upload/f_auto,q_auto/zbx4waahb8y74n03wfcm",
        href: "https://res.cloudinary.com/dijtcmvrm/image/upload/f_auto,q_auto/zbx4waahb8y74n03wfcm",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
