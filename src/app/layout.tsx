import type { Metadata } from 'next';
import './globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import StoreProvider from '@/store/StoreProvider';
import AppLayout from './AppLayout';

export const metadata: Metadata = {
  title: 'Employee Position Hierarchy',
  description: "Manage your organization's employee position hierarchy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body suppressHydrationWarning>
        <StoreProvider>
          <MantineProvider>
            <Notifications position="top-right" />
            <AppLayout>{children}</AppLayout>
          </MantineProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
