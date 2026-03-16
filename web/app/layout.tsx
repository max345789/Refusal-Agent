import type { Metadata } from 'next';
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { HelpChat } from '@/components/ui/HelpChat';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Refusal Bot — Protect Your Revenue from Refund Abuse',
  description: 'AI that enforces your store policies automatically.',
};

const headingFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const bodyFont = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={[
          headingFont.variable,
          bodyFont.variable,
          'antialiased min-h-screen bg-background',
        ].join(' ')}
      >
        <QueryProvider>
          {children}
          <HelpChat />
        </QueryProvider>
      </body>
    </html>
  );
}
