import { IncomingForm } from "formidable";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readableToNodeStream(request: Request): Promise<any> {
  const body = request.body;
  const contentLength = request.headers.get("content-length") || "0";
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.startsWith("multipart/form-data")) {
    throw new Error("Invalid Content-Type. Expected multipart/form-data.");
  }

  if (!body) throw new Error("Request body is null.");

  const readable = Readable.from(body as any);
  const req: any = readable;
  req.headers = {
    "content-length": contentLength,
    "content-type": contentType,
  };
  return req;
}

export async function POST(request: Request) {
  try {
    const form = new IncomingForm({ uploadDir: "./public/uploads", keepExtensions: true });
    const req = await readableToNodeStream(request);

    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const { files }: any = data;
    const uploadedFile = files?.image;
    if (!uploadedFile) {
      return NextResponse.json({ error: "파일 업로드 실패" }, { status: 400 });
    }

    const filePath = `/uploads/${uploadedFile.newFilename}`;
    return NextResponse.json({ filePath }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("업로드 오류:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      console.error("알 수 없는 오류 발생:", err);
      return NextResponse.json({ error: "알 수 없는 오류" }, { status: 500 });
    }
  }
}
