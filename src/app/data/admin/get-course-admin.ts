import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "./require-admin";

export async function getCourseAdmin(id: string) {
  await requireAdmin();

  const data = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      smallDescription: true,
      slug: true,
      category: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      status: true,
    },
  });

  if (!data) return notFound();

  return data;
}

export type AdminCourseType = Awaited<ReturnType<typeof getCourseAdmin>>;
