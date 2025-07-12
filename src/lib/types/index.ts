import { z } from "zod";
import { newCourseSchema } from "../schemas";

export type UserDropdownProps = {
  email: string;
  name: string;
  image?: string;
};

export type NewCourseType = z.infer<typeof newCourseSchema>;
