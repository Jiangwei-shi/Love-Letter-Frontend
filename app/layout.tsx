import React from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'LoveLetter - 情侣纪念网站',
  description: '记录我们在一起的每一个瞬间',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="site-header">
          <div className="container nav-row">
            <Link href="/" className="brand">LoveLetter</Link>
            <nav className="nav-links">
              <Link href="/timeline">时间线</Link>
              <Link href="/posts">生活记录</Link>
              <Link href="/albums">相册</Link>
              <Link href="/admin">后台</Link>
              <Link href="/login" className="btn btn-soft">登录</Link>
            </nav>
          </div>
        </header>
        <main className="container page-content">{children}</main>
      </body>
    </html>
  );
}
