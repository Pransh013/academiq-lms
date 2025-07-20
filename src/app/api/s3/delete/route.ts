import { env } from "@/env/client";
import { s3Client } from "@/lib/s3-client";
import { fileDeleteSchema } from "@/lib/schemas";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { success, data, error } = fileDeleteSchema.safeParse(body);

    if (!success) {
      return NextResponse.json(
        { error: "Missing or invalid file key", details: error },
        { status: 400 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: data.key,
    });

    await s3Client.send(command);
    return NextResponse.json(
      { message: "File deleted succesfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
