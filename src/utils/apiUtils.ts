// apiUtils.ts

import axios from 'axios';

// 인터페이스 정의
interface UploadResponse {
  imageUrl: string;
}

interface PuzzleResponse {
  id: string;
  pieces: PuzzlePiece[];
  difficulty: number;
}

interface SavePuzzleStateResponse {
  success: boolean;
}

interface PuzzlePiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

interface PuzzleState {
  id: string;
  pieces: PuzzlePiece[];
}

// 캐시 관리를 위한 간단한 유틸리티
const cache: { [key: string]: any } = {};

function setCache(key: string, data: any, expirationMs: number = 5 * 60 * 1000) {
  cache[key] = {
    data,
    expiration: Date.now() + expirationMs
  };
}

function getCache(key: string): any | null {
  const item = cache[key];
  if (item && Date.now() < item.expiration) {
    return item.data;
  }
  return null;
}

// 이미지 업로드 함수
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post<UploadResponse>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.imageUrl;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw new Error('이미지 업로드에 실패했습니다.');
  }
}

// 퍼즐 생성 요청 함수
export async function createPuzzle(imageUrl: string, difficulty: number): Promise<PuzzleResponse> {
  try {
    const response = await axios.post<PuzzleResponse>('/api/puzzle', { imageUrl, difficulty });
    return response.data;
  } catch (error) {
    console.error('퍼즐 생성 실패:', error);
    throw new Error('퍼즐 생성에 실패했습니다.');
  }
}

// 퍼즐 상태 저장 함수
export async function savePuzzleState(puzzleId: string, pieces: any[]): Promise<SavePuzzleStateResponse> {
  try {
    const response = await axios.put<SavePuzzleStateResponse>(`/api/puzzle/${puzzleId}`, { pieces });
    return response.data;
  } catch (error) {
    console.error('퍼즐 상태 저장 실패:', error);
    throw new Error('퍼즐 상태 저장에 실패했습니다.');
  }
}

// 퍼즐 상태 불러오기 함수
export async function loadPuzzleState(puzzleId: string): Promise<any> {
  try {
    const response = await axios.get(`/api/puzzle/${puzzleId}`);
    return response.data;
  } catch (error) {
    console.error('퍼즐 상태 불러오기 실패:', error);
    throw new Error('퍼즐 상태 불러오기 실패했습니다.');
  }
}
