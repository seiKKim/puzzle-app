"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import styles from "../../styles/puzzles.module.css";

type ImageData = string; // 이미지 경로 (문자열)

export default function PuzzlesPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 이미지 목록을 가져오는 함수
  const fetchImages = async () => {
    try {
      const res = await fetch("/api/images");
      if (!res.ok) {
        throw new Error("이미지 데이터를 불러올 수 없습니다.");
      }
      const data = await res.json();
      console.log("[DEBUG] Images:", data.images); // 디버깅 로그
      setImages(data.images || []);
    } catch (err: any) {
      console.error("Error fetching images:", err);
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) {
    return <div className={styles.emptyMessage}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.emptyMessage}>오류 발생: {error}</div>;
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>퍼즐 이미지 선택</h1>

      <div className={styles.grid}>
        {images.map((image, index) => (
          <div key={index} className={styles.card}>
            <img
              src={image} // API에서 반환된 경로를 그대로 사용
              alt={`Uploaded Image ${index + 1}`}
              className={styles.cardImage}
            />
            <Link
              href={{
                pathname: "/puzzles/start",
                query: { image },
              }}
            >
              <button className={styles.cardButton}>
                이 이미지로 퍼즐 게임 시작
              </button>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
