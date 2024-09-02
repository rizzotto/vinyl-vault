import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./fonts";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "Vinyl Vault",
  description: "Check if a vinyl exists from your favorite musics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
