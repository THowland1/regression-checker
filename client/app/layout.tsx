"use client";

import "../styles/reset.scss";
import "../styles/globals.scss";
import styles from "./Layout.module.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <html>
        <head></head>
        <body className={styles.body}>{children}</body>
      </html>
    </QueryClientProvider>
  );
}
