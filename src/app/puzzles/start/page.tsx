"use client";

import { useEffect, useState } from "react";

import PuzzleBoard from "../../../componts/PuzzleBoard";
import { useSearchParams } from "next/navigation";

// 데이터 타입 정의
interface PuzzlePiece {
  path: string;
  row: number;
  col: number;
  left: number;
  top: number;
}

interface PuzzleData {
  pieces: PuzzlePiece[];
  dimensions: {
    rows: number;
    cols: number;
    width: number;
    height: number;
    baseWidth: number;
    baseHeight: number;
  };
}

// API 호출 함수
async function fetchPuzzleData(imagePath: string): Promise<PuzzleData> {
  try {
    const response = await fetch("/api/puzzle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagePath, rows: 3, cols: 3 }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch puzzle data. Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching puzzle data:", error);
    throw error;
  }
}

export default function PuzzleStartPage() {
  const searchParams = useSearchParams();
  const imagePath = searchParams.get("image");

  const [puzzleData, setPuzzleData] = useState<PuzzleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imagePath) {
      setError("이미지 경로가 제공되지 않았습니다.");
      setLoading(false);
      return;
    }

    fetchPuzzleData(imagePath)
      .then((data) => {
        setPuzzleData(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [imagePath]);

  // 로딩 표시
  if (loading) return <div>로딩 중...</div>;

  // 오류 표시
  if (error) return <div className="text-red-500">오류 발생: {error}</div>;

  // puzzleData가 null인 경우 처리
  if (!puzzleData || !puzzleData.dimensions) {
    return <div>퍼즐 데이터를 불러오는 중 문제가 발생했습니다.</div>;
  }
  
  // 퍼즐 데이터 렌더링
  return (
    <main>
      <h1 className="text-3xl font-bold text-center mb-6">퍼즐 게임</h1>
      <PuzzleBoard
        pieces={puzzleData.pieces}
        rows={puzzleData.dimensions.rows}
        cols={puzzleData.dimensions.cols}
        imagePath={imagePath || ""}
        imageWidth={puzzleData.dimensions.width}
        imageHeight={puzzleData.dimensions.height}
      />
    </main>
  );
}
