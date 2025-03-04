// # 상단 네비게이션 바

import Link from "next/link";
import styles from "./Navbar.module.css"; // CSS 모듈 import
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // 모바일 메뉴의 열림/닫힘 상태 관리

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* 로고 */}
        <Link href="/" className={styles.logo}>
          Puzzle Game
        </Link>

        {/* 햄버거 버튼 */}
        <button
          className={styles.hamburgerButton}
          onClick={() => setIsOpen(!isOpen)} // 열림/닫힘 토글
          aria-label="Toggle Menu"
        >
          {/* 햄버거 메뉴 아이콘 */}
          <svg
            className={styles.hamburgerIcon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* 링크들 (데스크탑) */}
        <div className={`${styles.links} ${isOpen ? styles.linksMobileOpen : ""}`}>
          <Link href="/" className={styles.link} onClick={() => setIsOpen(false)}>
            홈
          </Link>
          <Link href="/puzzles" className={styles.link} onClick={() => setIsOpen(false)}>
            퍼즐 목록
          </Link>
          <Link href="/about" className={styles.link} onClick={() => setIsOpen(false)}>
            소개
          </Link>
          <Link href="/contact" className={styles.link} onClick={() => setIsOpen(false)}>
            연락하기
          </Link>
        </div>
      </div>
    </nav>
  );
}
