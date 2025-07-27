import { z } from "zod";
import { courseSchema } from "../schemas";

export type UserDropdownProps = {
  email: string;
  name: string;
  image?: string;
};

export type CourseType = z.infer<typeof courseSchema>;

export type ActionResponse<T> = {
  status: "success" | "error";
  message: string;
  data?: T;
};
