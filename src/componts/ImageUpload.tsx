// # 이미지 업로드 컴포넌트

"use client";

import { useState } from "react";

type ImageUploadProps = {
  onUploadSuccess: (filePath: string) => void;
};

export default function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("업로드할 파일을 선택해주세요!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file); // "image"라는 키로 파일 데이터 추가

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData, // FormData를 직접 전달 → Content-Type 자동 설정
      });

      if (!res.ok) throw new Error("업로드 실패");

      const data = await res.json();
      onUploadSuccess(data.filePath);
    } catch (err) {
      console.error("업로드 오류:", err);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>업로드</button>
    </div>
  );
}

