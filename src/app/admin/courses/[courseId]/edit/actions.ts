"use server";

import { detectBot, request, slidingWindow } from "@arcjet/next";

import { prisma } from "@/lib/prisma";
import { courseSchema } from "@/lib/schemas";
import { ActionResponse, CourseType } from "@/lib/types";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet from "@/lib/arcjet";

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
      max: 4,
      interval: "1m",
    })
  );

export async function editCourse(
  formData: CourseType,
  id: string
): Promise<ActionResponse<void>> {
  const session = await requireAdmin();

  const req = await request();
  const decision = await aj.protect(req, {
    fingerprint: session.user.id,
  });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return {
        status: "error",
        message: "Too many requests. Please try again later.",
      };
    }
    if (decision.reason.isBot()) {
      return {
        status: "error",
        message: "Request blocked: bot detected.",
      };
    }
    return {
      status: "error",
      message: "Request denied by security policy.",
    };
  }

  const { success, data, error } = courseSchema.safeParse(formData);
  if (!success) {
    return {
      status: "error",
      message: error.message || "Invalid Form Data",
    };
  }

  try {
    await prisma.course.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        ...data,
      },
    });
    return {
      status: "success",
      message: "Course updated succesfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update course",
    };
  }
}
