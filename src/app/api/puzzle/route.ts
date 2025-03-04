import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import sharp from "sharp";

// 퍼즐 데이터 타입 정의
interface PuzzlePiece {
  path: string;
  row: number;
  col: number;
  left: number;
  top: number;
}

let isProcessing = false;

// POST API 핸들러
export async function POST(req: Request) {
  if (isProcessing) {
    return NextResponse.json({ error: "Server is busy." }, { status: 429 });
  }

  isProcessing = true;
  try {
    const { imagePath, rows, cols } = await req.json();

    if (!imagePath || rows <= 0 || cols <= 0) {
      throw new Error("Invalid input data.");
    }

    const fullPath = path.join(process.cwd(), "public", imagePath);
    const outputDir = path.join(process.cwd(), "public/puzzle");
    ensureDirectory(outputDir);

    const { width, height } = await getImageMetadata(fullPath);
    const puzzleData = await generatePuzzlePieces(fullPath, outputDir, width, height, rows, cols);

    return NextResponse.json({ pieces: puzzleData.pieces, dimensions: puzzleData.dimensions });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    isProcessing = false;
  }
}

// 디렉토리 생성 함수
function ensureDirectory(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

// 이미지 메타데이터 가져오기
async function getImageMetadata(filePath: string) {
  const image = sharp(filePath);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Invalid image dimensions.");
  }

  return { width: metadata.width, height: metadata.height };
}

// 퍼즐 조각 생성
async function generatePuzzlePieces(
  filePath: string,
  outputDir: string,
  imageWidth: number,
  imageHeight: number,
  rows: number,
  cols: number
) {
  const baseWidth = Math.floor(imageWidth / cols);
  const baseHeight = Math.floor(imageHeight / rows);
  const tabSize = Math.min(baseWidth, baseHeight) * 0.18;

  const uniqueId = crypto.randomUUID();
  const puzzlePieces: PuzzlePiece[] = [];
  const edges = initializeEdges(rows, cols);

  const promises = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      promises.push(
        createPuzzlePiece(r, c, edges, baseWidth, baseHeight, tabSize, filePath, outputDir, uniqueId, puzzlePieces)
      );
    }
  }
  await Promise.all(promises);

  return {
    pieces: puzzlePieces.sort((a, b) => a.row - b.row || a.col - b.col),
    dimensions: { rows, cols, width: imageWidth, height: imageHeight, baseWidth, baseHeight },
  };
}

// 퍼즐 간의 탭/홈 초기화
function initializeEdges(rows: number, cols: number) {
  const edges = {
    vertical: Array(rows).fill(null).map(() => Array(cols + 1).fill(0)),
    horizontal: Array(rows + 1).fill(null).map(() => Array(cols).fill(0)),
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // 오른쪽
      if (c < cols - 1) {
        edges.vertical[r][c + 1] = Math.random() > 0.5 ? 1 : -1;
        edges.vertical[r][c] = -edges.vertical[r][c + 1];
      }
      // 아래쪽
      if (r < rows - 1) {
        edges.horizontal[r + 1][c] = Math.random() > 0.5 ? 1 : -1;
        edges.horizontal[r][c] = -edges.horizontal[r + 1][c];
      }
    }
  }

  return edges;
}

// 단일 퍼즐 조각 생성
async function createPuzzlePiece(
  row: number,
  col: number,
  edges: any,
  baseWidth: number,
  baseHeight: number,
  tabSize: number,
  filePath: string,
  outputDir: string,
  uniqueId: string,
  puzzlePieces: PuzzlePiece[]
) {
  const left = col * baseWidth;
  const top = row * baseHeight;
  const pieceWidth = baseWidth;
  const pieceHeight = baseHeight;

  const outputPath = path.join(outputDir, `${uniqueId}_piece-${row}-${col}.png`);

  // SVG 경로 생성 및 마스크 적용
  const svgPath = generateJigsawPiecePath(
    pieceWidth,
    pieceHeight,
    tabSize,
    col > 0 ? edges.vertical[row][col - 1] : 0,
    row > 0 ? edges.horizontal[row - 1][col] : 0,
    edges.vertical[row][col + 1] || 0,
    edges.horizontal[row + 1]?.[col] || 0
  );

  const svgMask = `
    <svg width="${pieceWidth}" height="${pieceHeight}" xmlns="http://www.w3.org/2000/svg">
      <path d="${svgPath}" fill="white" />
    </svg>
  `;

  const buffer = await sharp(filePath)
    .extract({ left, top, width: pieceWidth, height: pieceHeight })
    .composite([{ input: Buffer.from(svgMask), blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp(buffer).toFile(outputPath);

  puzzlePieces.push({ path: `/puzzle/${uniqueId}_piece-${row}-${col}.png`, row, col, left, top });
}

// 직소 퍼즐 조각 경로 - 자연스러운 곡선 구현
function generateJigsawPiecePath(
  width: number,
  height: number,
  tabSize: number,
  leftType: number,
  topType: number,
  rightType: number,
  bottomType: number
) {
  return `M 0,0
    h ${width / 2 - tabSize / 2}
    ${generateTabPath(tabSize, topType)}
    h ${width / 2 - tabSize / 2}
    v ${height / 2 - tabSize / 2}
    ${generateTabPath(tabSize, rightType)}
    v ${height / 2 - tabSize / 2}
    h -${width / 2 - tabSize / 2}
    ${generateTabPath(tabSize, -bottomType)}
    h -${width / 2 - tabSize / 2}
    v -${height / 2 - tabSize / 2}
    ${generateTabPath(tabSize, -leftType)}
    v -${height / 2 - tabSize / 2}
    z`;
}

// 탭/홈 경로 곡선 생성
function generateTabPath(size: number, type: number) {
  if (type === 0) return ""; // 직선 처리
  const direction = type > 0 ? 1 : -1;
  const curve = size * 0.6 * direction;
  return `c ${size * 0.3},0 ${size * 0.6},${curve} ${size},${curve}
          c -${size * 0.3},${curve / 2} -${size * 0.7},${curve / 2} -${size},0`;
}
