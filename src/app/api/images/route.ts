// public/uploads 디렉토리의 이미지 목록 반환

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), "public/uploads"); // 업로드 디렉토리
    const fileNames = await fs.promises.readdir(uploadDir); // 파일 목록 읽기

    const imageFiles = fileNames.filter((file) =>
      /\.(jpeg|jpg|png|gif)$/i.test(file)
    );

    // 이미지 경로 반환
    const imagePaths = imageFiles.map((file) => `/uploads/${file}`);

    return NextResponse.json({ images: imagePaths });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Unable to fetch images" },
      { status: 500 }
    );
  }
}
