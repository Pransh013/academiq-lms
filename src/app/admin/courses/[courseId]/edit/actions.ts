"use server";

import { revalidatePath } from "next/cache";
import { detectBot, slidingWindow } from "@arcjet/next";

import { prisma } from "@/lib/prisma";
import {
  courseSchema,
  createChapterSchema,
  reorderChapterSchema,
  reorderLessonSchema,
} from "@/lib/schemas";
import {
  ActionResponse,
  CourseType,
  CreateChapterType,
  ReorderChapterType,
  ReorderLessonType,
} from "@/lib/types";
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
      max: 5,
      interval: "1m",
    })
  );

export async function editCourse(
  formData: CourseType,
  id: string
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

export async function reorderChapters(
  payload: ReorderChapterType
): Promise<ActionResponse<void>> {
  const session = await requireAdmin();

  const deniedReason = await verifyRequest(aj, session.user.id);
  if (deniedReason) {
    return { status: "error", message: deniedReason };
  }

  const { success, data, error } = reorderChapterSchema.safeParse(payload);
  if (!success) {
    return {
      status: "error",
      message: error.message || "Invalid Course Structure",
    };
  }

  const { courseId, chapters } = data;

  try {
    await prisma.$transaction(
      chapters.map((chapter) =>
        prisma.chapter.update({
          where: { id: chapter.id, courseId },
          data: { position: chapter.position },
        })
      )
    );

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder chapters",
    };
  }
}

export async function reorderLessons(
  payload: ReorderLessonType
): Promise<ActionResponse<void>> {
  const session = await requireAdmin();

  const deniedReason = await verifyRequest(aj, session.user.id);
  if (deniedReason) {
    return { status: "error", message: deniedReason };
  }

  const { success, data, error } = reorderLessonSchema.safeParse(payload);
  if (!success) {
    return {
      status: "error",
      message: error.message || "Invalid Course Structure",
    };
  }

  const { courseId, chapterId, lessons } = data;

  try {
    await prisma.$transaction(
      lessons.map((lesson) =>
        prisma.lesson.update({
          where: { id: lesson.id, chapterId },
          data: { position: lesson.position },
        })
      )
    );

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder lessons",
    };
  }
}

export async function createChapter(
  formData: CreateChapterType
): Promise<ActionResponse<void>> {
  const session = await requireAdmin();

  const deniedReason = await verifyRequest(aj, session.user.id);
  if (deniedReason) {
    return { status: "error", message: deniedReason };
  }

  const { success, data, error } = createChapterSchema.safeParse(formData);
  if (!success) {
    return {
      status: "error",
      message: error.message || "Invalid Form Data",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.chapter.findFirst({
        where: { courseId: data.courseId },
        select: { position: true },
        orderBy: { position: "desc" },
      });

      await tx.chapter.create({
        data: {
          title: data.name,
          courseId: data.courseId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${data.courseId}/edit`);
    return {
      status: "success",
      message: "Chapter added succesfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to add chapter",
    };
  }
}
