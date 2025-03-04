import "./globals.css"; // 전역 스타일

import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode; // 자식 요소를 받는 타입 정의
};

export const metadata = {
  title: "퍼즐 게임",
  description: "이미지를 업로드하고 나만의 퍼즐 게임을 즐겨보세요.",
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="ko">
      <body>
        {/* 공통 네비게이션 바 */}
        <header>
          <nav className="navbar">
            <div className="container">
              <a href="/" className="logo">Puzzle Game</a>
              <ul>
                <li><a href="/">홈</a></li>
                <li><a href="/puzzles">퍼즐 목록</a></li>
                <li><a href="/about">소개</a></li>
                <li><a href="/contact">문의</a></li>
              </ul>
            </div>
          </nav>
        </header>

        {/* 페이지 컨텐츠 */}
        <main className="content">
          {children}
        </main>

        {/* 푸터 */}
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Puzzle Game. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
