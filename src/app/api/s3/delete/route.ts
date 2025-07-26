import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { detectBot, slidingWindow } from "@arcjet/next";

import { env } from "@/env/client";
import arcjet from "@/lib/arcjet";
import { s3Client } from "@/lib/s3-client";
import { fileDeleteSchema } from "@/lib/schemas";
import { requireAdmin } from "@/app/data/admin/require-admin";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    slidingWindow({
      mode: "LIVE",
      max: 5,
      interval: "1m",
    })
  );

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  try {
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });
    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Request blocked by security policy." },
        { status: 429 }
      );
    }

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
