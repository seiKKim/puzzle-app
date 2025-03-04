"use client";

import Link from "next/link";
import UploadForm from "../componts/UploadForm";
import styles from "@/styles/Home.module.css";
import { useState } from "react";

export default function HomePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // 업로드 성공 시 이미지 경로 설정
  const handleUploadSuccess = (data: { id: string; url: string }) => {
    setUploadedImage(data.url); // `url` 속성 사용
  };

  return (
    <main className={styles.main}>
      {/* 헤더 */}
      <header className={styles.header}>
        <h1 className={styles.title}>퍼즐 게임에 오신 것을 환영합니다!</h1>
        <p className={styles.description}>
          이미지를 업로드하고 나만의 퍼즐을 만들어보세요. 다양한 난이도로 도전할 수 있습니다.
        </p>
      </header>

      {/* 업로드 폼 */}
      <section className={styles.uploadSection}>
        <h2 className={styles.sectionTitle}>이미지 업로드</h2>
        <UploadForm onUploadSuccess={handleUploadSuccess} />

        {/* 업로드 후 이미지 미리보기 */}
        {uploadedImage && (
          <div className={styles.preview}>
            <h3>업로드한 이미지:</h3>
            <img
              src={uploadedImage}
              alt="Uploaded Preview"
              className={styles.previewImage}
            />
            <Link
              href={{
                pathname: "/puzzles",
                query: { image: uploadedImage },
              }}
              className={styles.startGameButton}
            >
              이 이미지로 퍼즐 시작하기
            </Link>
          </div>
        )}
      </section>

      {/* 기본 퍼즐 선택 */}
      <section className={styles.defaultPuzzlesSection}>
        <h2 className={styles.sectionTitle}>기본 퍼즐 선택</h2>
        <div className={styles.puzzles}>
          {/* 예제 퍼즐 */}
          <Link href="/puzzles?id=puzzle1" className={styles.puzzleItem}>
            <img src="/puzzle/beach-sunrise-500x259.jpg" alt="Example Puzzle 1" />
            <p>퍼즐 1</p>
          </Link>
          <Link href="/puzzles?id=puzzle2" className={styles.puzzleItem}>
            <img src="/puzzle/delightful-spreads-477x300.jpg" alt="Example Puzzle 2" />
            <p>퍼즐 2</p>
          </Link>
          <Link href="/puzzles?id=puzzle3" className={styles.puzzleItem}>
            <img src="/puzzle/ribeira-grande-bc-492x300.jpg" alt="Example Puzzle 3" />
            <p>퍼즐 3</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
