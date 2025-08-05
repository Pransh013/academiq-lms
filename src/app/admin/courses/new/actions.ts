"use server";

import { detectBot, slidingWindow } from "@arcjet/next";

import { prisma } from "@/lib/prisma";
import { courseSchema } from "@/lib/schemas";
import { ActionResponse, CourseType } from "@/lib/types";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import { verifyRequest } from "@/lib/utils/verify-request";

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
      max: 3,
      interval: "1m",
    })
  );

export async function createCourse(
  formData: CourseType
): Promise<ActionResponse<void>> {
  const session = await requireAdmin();

  const deniedReason = await verifyRequest(aj, session.user.id);
  if (deniedReason) {
    return { status: "error", message: deniedReason };
  }

  const { success, data, error } = courseSchema.safeParse(formData);
  if (!success) {
    return {
      status: "error",
      message: error.message || "Invalid Form Data",
    };
  }

  try {
    await prisma.course.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });
    return {
      status: "success",
      message: "Course created succesfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
