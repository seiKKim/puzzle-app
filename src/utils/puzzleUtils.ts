// # 퍼즐 생성 유틸 함수 (셔플, 위치 계산 등)
// puzzleUtils.ts

// 퍼즐 조각의 인터페이스
interface PuzzlePiece {
    id: number;
    x: number;
    y: number;
    rotation: number;
  }
  
  // 퍼즐 조각 생성 함수
  export function createPuzzlePieces(rows: number, cols: number): PuzzlePiece[] {
    const pieces: PuzzlePiece[] = [];
    for (let i = 0; i < rows * cols; i++) {
      pieces.push({
        id: i,
        x: (i % cols) * 100, // 100은 조각의 너비
        y: Math.floor(i / cols) * 100, // 100은 조각의 높이
        rotation: 0
      });
    }
    return pieces;
  }
  
  // 퍼즐 조각 섞기 함수
  export function shufflePuzzlePieces(pieces: PuzzlePiece[]): PuzzlePiece[] {
    return [...pieces].sort(() => Math.random() - 0.5);
  }
  
  // 퍼즐 완성 체크 함수
  export function isPuzzleComplete(pieces: PuzzlePiece[], rows: number, cols: number): boolean {
    return pieces.every((piece, index) => 
      piece.x === (index % cols) * 100 && 
      piece.y === Math.floor(index / cols) * 100 &&
      piece.rotation === 0
    );
  }
  
  // 퍼즐 조각 회전 함수
  export function rotatePuzzlePiece(piece: PuzzlePiece, angle: number): PuzzlePiece {
    return {
      ...piece,
      rotation: (piece.rotation + angle) % 360
    };
  }
  