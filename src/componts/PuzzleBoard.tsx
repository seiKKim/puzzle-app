"use client";

import { DragEvent, useEffect, useState } from "react";

import PuzzlePiece from "./PuzzlePiece";

// 퍼즐 조각 데이터 타입 정의
interface PieceData {
  path: string;
  row: number;
  col: number;
  left: number;
  top: number;
}

type PuzzleBoardProps = {
  pieces: PieceData[];
  rows: number;
  cols: number;
  imagePath: string;
  imageWidth: number;
  imageHeight: number;
};

// 난이도 옵션 정의
const DIFFICULTY_OPTIONS = [
  { label: "6 조각 (2×3)", rows: 2, cols: 3 },
  { label: "9 조각 (3×3)", rows: 3, cols: 3 },
  { label: "12 조각 (3×4)", rows: 3, cols: 4 },
  { label: "16 조각 (4×4)", rows: 4, cols: 4 },
  { label: "24 조각 (4×6)", rows: 4, cols: 6 },
  { label: "30 조각 (5×6)", rows: 5, cols: 6 },
  { label: "35 조각 (5×7)", rows: 5, cols: 7 },
  { label: "42 조각 (6×7)", rows: 6, cols: 7 },
  { label: "48 조각 (6×8)", rows: 6, cols: 8 },
  { label: "56 조각 (7×8)", rows: 7, cols: 8 },
  { label: "63 조각 (7×9)", rows: 7, cols: 9 },
];

// 퍼즐 보드 컴포넌트
export default function PuzzleBoard({
  pieces,
  rows,
  cols,
  imagePath,
  imageWidth,
  imageHeight,
}: PuzzleBoardProps) {
  const [puzzlePieces, setPuzzlePieces] = useState<PieceData[]>(pieces);
  const [shuffledPieces, setShuffledPieces] = useState<string[]>([]);
  const [currentRows, setCurrentRows] = useState(rows);
  const [currentCols, setCurrentCols] = useState(cols);
  const [basePieceSize, setBasePieceSize] = useState(0); // 기본 조각 사이즈

  const [completed, setCompleted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false); // 게임 활성 상태
  const [isChangingDifficulty, setIsChangingDifficulty] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState({
    rows,
    cols,
  });

  // 타이머 관리
  useEffect(() => {
    let timer: number | undefined;
    if (isTimerRunning) {
      timer = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer !== undefined) {
        window.clearInterval(timer);
      }
    };
  }, [isTimerRunning]);

  // 조각 크기 계산
  useEffect(() => {
    const baseSize = Math.min(
      Math.floor(imageWidth / currentCols),
      Math.floor(imageHeight / currentRows)
    );
    setBasePieceSize(baseSize);
  }, [imageWidth, imageHeight, currentRows, currentCols]);

  // 완료 처리
  useEffect(() => {
    if (completed) {
      setIsTimerRunning(false);
      setIsGameActive(false);
    }
  }, [completed]);

  // 드래그 시작
  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("index", index.toString());
  };

  // 드롭 처리
  const handleDrop = (e: DragEvent<HTMLDivElement>, targetIndex: number) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("index"), 10);

    const updatedPieces = [...shuffledPieces];
    [updatedPieces[draggedIndex], updatedPieces[targetIndex]] = [
      updatedPieces[targetIndex],
      updatedPieces[draggedIndex],
    ];

    setShuffledPieces(updatedPieces);
    setMoves((prev) => prev + 1);

    if (checkIfSolved(updatedPieces)) {
      setCompleted(true);
    }
  };

  // 드래그 오버
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // 퍼즐 완료 확인
  const checkIfSolved = (pieces: string[]): boolean => {
    return JSON.stringify(pieces) === JSON.stringify(puzzlePieces.map((piece) => piece.path));
  };

  // 게임 시작
  const startGame = () => {
    setShuffledPieces([...puzzlePieces.map((piece) => piece.path)].sort(() => Math.random() - 0.5));
    setMoves(0);
    setTime(0);
    setCompleted(false);
    setIsTimerRunning(true);
    setIsGameActive(true);
  };

  // 난이도 변경
  const changeDifficulty = async (rows: number, cols: number) => {
    setIsChangingDifficulty(true);
    setIsTimerRunning(false);
    setIsGameActive(false);
    try {
      // API 호출
      const response = await fetch("/api/puzzle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagePath, rows, cols }),
      });

      if (!response.ok) throw new Error("새 퍼즐 데이터를 가져오지 못했습니다.");

      const data = await response.json();
      setPuzzlePieces(data.pieces);
      setCurrentRows(rows);
      setCurrentCols(cols);
      setShuffledPieces([]);
      setCompleted(false);
      setMoves(0);
      setTime(0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChangingDifficulty(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="puzzle-board">
      <h1 className="text-2xl font-bold text-center mb-4">
        {completed ? "퍼즐이 완성되었습니다!" : isGameActive ? "퍼즐을 맞춰 보세요!" : "난이도를 선택하고 게임을 시작하세요."}
      </h1>

      {/* 난이도 선택 */}
      <div className="mb-4">
        <label htmlFor="difficulty" className="block mb-2 font-medium">
          난이도:
        </label>
        <select
          id="difficulty"
          className="w-full p-2 border rounded"
          onChange={(e) => {
            const difficulty = DIFFICULTY_OPTIONS[parseInt(e.target.value, 10)];
            changeDifficulty(difficulty.rows, difficulty.cols);
          }}
          disabled={isChangingDifficulty}
        >
          {DIFFICULTY_OPTIONS.map((option, index) => (
            <option key={index} value={index}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 게임 시작 버튼 */}
      {!isGameActive && !isChangingDifficulty && (
        <div className="text-center mb-4">
          <button
            onClick={startGame}
            disabled={isChangingDifficulty}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            게임 시작
          </button>
        </div>
      )}

      {/* 퍼즐 보드 */}
      {isGameActive && (
        <div
          className="grid border"
          style={{
            gridTemplateRows: `repeat(${currentRows}, ${basePieceSize}px)`,
            gridTemplateColumns: `repeat(${currentCols}, ${basePieceSize}px)`,
          }}
        >
          {shuffledPieces.map((path, index) => (
            <PuzzlePiece
              key={index}
              src={path}
              index={index}
              draggable={!completed}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            />
          ))}
        </div>
      )}

      {/* 게임 정보 */}
      <div className="mt-4 text-center">
        {completed && <p className="text-green-500">축하합니다! 퍼즐을 완성했습니다!</p>}
        {isGameActive && (
          <>
            <p>이동 횟수: {moves}</p>
            <p>시간: {formatTime(time)}</p>
          </>
        )}
      </div>
    </div>
  );
}
