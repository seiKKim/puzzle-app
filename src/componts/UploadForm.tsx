// # 이미지 업로드 폼
"use client";

import styles from "@/styles/UploadForm.module.css"; // CSS 모듈 사용
import { useState } from "react";

type UploadFormProps = {
  onUploadSuccess: (data: { id: string; url: string }) => void;
};

export default function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); // 로딩 상태 추가
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // 에러 메시지 상태 추가

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null); // 에러 메시지 초기화
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        // 파일 크기 제한 (5MB)
        setErrorMessage("파일 크기는 5MB를 초과할 수 없습니다.");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("파일을 선택하세요!");
    setIsUploading(true); // 업로드 시작 상태 설정

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("업로드 실패");
      }

      const data = await res.json();
      onUploadSuccess(data); // 부모 컴포넌트로 데이터 전달
      setFile(null);
      setPreview(null); // 업로드 성공 후 상태 초기화
    } catch (err) {
      console.error("Upload Error:", err);
      setErrorMessage("이미지 업로드 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false); // 업로드 상태 종료
    }
  };

  return (
    <div className={styles.uploadForm}>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      {preview && (
        <div className={styles.preview}>
          <img src={preview} alt="Preview" />
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={isUploading} // 로딩 중 버튼 비활성화
        className={`${styles.uploadButton} ${isUploading ? styles.disabled : ""}`}
      >
        {isUploading ? "업로드 중..." : "업로드"}
      </button>
    </div>
  );
}
