import React from 'react';
import { Inter, Noto_Serif } from 'next/font/google';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './globals.css';
import SiteHeader from '@/shell/SiteHeader';
import MantineRootProvider from '@/shell/MantineRootProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  variable: '--font-noto-serif',
  display: 'swap',
});

export const metadata = {
  title: 'LoveLetter - 情侣纪念网站',
  description: '记录我们在一起的每一个瞬间',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${notoSerif.variable}`}>
      <body>
        <MantineRootProvider>
          <SiteHeader />
          <main className="container page-content">{children}</main>
        </MantineRootProvider>
      </body>
    </html>
  );
}
