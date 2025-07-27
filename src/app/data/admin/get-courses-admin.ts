import { prisma } from "@/lib/prisma";
import { requireAdmin } from "./require-admin";

export async function getCoursesAdmin() {
  await requireAdmin();

  const data = await prisma.course.findMany({
    select: {
      id: true,
      title: true,
      smallDescription: true,
      fileKey: true,
      duration: true,
      price: true,
      slug: true,
      level: true,
      status: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data;
}

export type AdminCourseCardType = Awaited<ReturnType<typeof getCoursesAdmin>>[0];
