import React from 'react';
import Link from 'next/link';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './globals.css';
import UserMenu from '@/components/UserMenu';
import MantineRootProvider from '@/components/MantineRootProvider';

export const metadata = {
  title: 'LoveLetter - 情侣纪念网站',
  description: '记录我们在一起的每一个瞬间',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <MantineRootProvider>
          <header className="site-header">
            <div className="container nav-row">
              <Link href="/" className="brand">LoveLetter</Link>
              <nav className="nav-links">
                <Link href="/timeline">时间线</Link>
                <Link href="/posts">生活记录</Link>
                <Link href="/about">关于我们</Link>
                <UserMenu />
              </nav>
            </div>
          </header>
          <main className="container page-content">{children}</main>
        </MantineRootProvider>
      </body>
    </html>
  );
}
