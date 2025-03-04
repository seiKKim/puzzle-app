// # 퍼즐 조각 컴포넌트

"use client";

import { DragEvent } from "react";

type PuzzlePieceProps = {
  src: string; // 퍼즐 조각 이미지 경로
  index: number; // 조각의 인덱스
  draggable: boolean; // 드래그 가능한지 여부
  onDragStart: (e: DragEvent<HTMLDivElement>, index: number) => void; // 드래그 시작 시 실행되는 함수
  onDrop: (e: DragEvent<HTMLDivElement>, index: number) => void; // 드래그 후 드롭 시 실행되는 함수
  onDragOver: (e: DragEvent<HTMLDivElement>) => void; // 드래그가 요소 위를 지나갈 때 실행되는 함수
};

export default function PuzzlePiece({
  src, //해당 퍼즐 조각의 이미지 경로.
  index, //퍼즐 조각의 배열 인덱스 값.
  draggable, //퍼즐 조각이 드래그 가능한지 여부(퍼즐이 완료되었을 때 비활성화 가능).
  onDragStart, //드래그 동작 시작 시 실행될 콜백 함수.(드래그를 시작했을 때 부모에서 전달된 index를 이벤트 데이터에 저장하여 이후 드롭 시 활용 가능.)
  onDrop, //드롭이 완료된 후 실행될 콜백 함수. (드롭 이벤트가 발생하면 부모에게 어떤 조각이 드롭되었는지 정보를 전달.)
  onDragOver, //퍼즐 조각 위에서 드래그가 진행 중일 때 동작. (드래그 중에 기본 동작을 막아 드롭이 가능하도록 처리.)
}: PuzzlePieceProps) {
  return (
    <div
      className="puzzle-piece border cursor-pointer"
      draggable={draggable}
      onDragStart={(e) => onDragStart(e, index)} // 드래그 시작
      onDrop={(e) => onDrop(e, index)} // 드롭 처리
      onDragOver={onDragOver} // 드래그 위를 지나갈 때
    >
      <img
        src={src}
        alt={`Puzzle piece ${index}`}
        draggable={false} // 이미지는 드래그되지 않도록 설정
        className="w-full h-full object-cover"
      />
    </div>
  );
}
