import { z } from "zod";
import {
  courseSchema,
  reorderChapterSchema,
  reorderLessonSchema,
} from "../schemas";

export type UserDropdownProps = {
  email: string;
  name: string;
  image?: string;
};

export type CourseType = z.infer<typeof courseSchema>;

export type ReorderChapterType = z.infer<typeof reorderChapterSchema>;

export type ReorderLessonType = z.infer<typeof reorderLessonSchema>;

export type ActionResponse<T> = {
  status: "success" | "error";
  message: string;
  data?: T;
};
