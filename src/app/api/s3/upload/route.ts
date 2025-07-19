import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

import { env } from "@/env/client";
import { s3Client } from "@/lib/s3-client";
import { fileUploadSchema } from "@/lib/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { success, data, error } = fileUploadSchema.safeParse(body);

    if (!success) {
      return NextResponse.json(
        { error: "Invalid Request Body", details: error },
        { status: 400 }
      );
    }

    const { fileName, contentType, size } = data;

    const fileKey = `images/${uuid()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
      ContentLength: size,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300,
    });

    return NextResponse.json({
      presignedUrl,
      fileKey,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
