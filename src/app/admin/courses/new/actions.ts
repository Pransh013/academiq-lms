"use server";

import { detectBot, request, slidingWindow } from "@arcjet/next";

import { prisma } from "@/lib/prisma";
import { newCourseSchema } from "@/lib/schemas";
import { ActionResponse, NewCourseType } from "@/lib/types";
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

export async function createCourse(
  values: NewCourseType
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

  const { success, data, error } = newCourseSchema.safeParse(values);
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
