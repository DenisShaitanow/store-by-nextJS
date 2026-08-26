import type { Metadata } from "next";
import { StoreProvider } from './StoreProvider';
import { ThemeProvider } from './(themeContext)/ThemeContext';


export const metadata: Metadata = {
  title: "StoreThings",
  description: "StoreThings - магазин.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
    
    >
      <head>
      <link rel="icon" type="image/svg+xml" href="/iconLogo.svg" />
      </head>
      <body >

      <StoreProvider>
        <ThemeProvider>
          {children}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
