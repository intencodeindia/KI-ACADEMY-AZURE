import "./globals.css";
import type { Metadata } from "next";
import { metadataObj } from "./utils/metadata";
import { Providers } from "./redux/StoreProvider";
import Layout from "./components/layout/Layout";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import SessionWrapper from "./components/nextauth/SessionWrapper";
import Script from "next/script";
import 'bootstrap/dist/css/bootstrap.min.css'
// Use the metadata object for SEO
export const metadata: Metadata = metadataObj;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Load Bootstrap CSS */}
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />


      </head>
      <body>
        <SessionWrapper>
          <Providers>
            <Layout>
              <AppRouterCacheProvider>
                {children}
              </AppRouterCacheProvider>
            </Layout>
          </Providers>
        </SessionWrapper>
      </body>
      {/* Use next/script for asynchronous loading of Bootstrap JS */}
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossOrigin="anonymous"
        strategy="afterInteractive" // Load after the page has become interactive
      />

    </html>
  );
}