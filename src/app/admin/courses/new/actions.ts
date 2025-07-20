"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { newCourseSchema } from "@/lib/schemas";
import { ActionResponse, NewCourseType } from "@/lib/types";

export async function createCourse(
  values: NewCourseType
): Promise<ActionResponse<void>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    return {
      status: "error",
      message: "Unauthorized",
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
  } catch (error) {
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
