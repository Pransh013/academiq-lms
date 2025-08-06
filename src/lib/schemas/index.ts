import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const verifyOtpSchema = signinSchema.extend({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

export const courseStatus = ["Draft", "Published", "Archived"] as const;
export const courseLevel = ["Beginner", "Intermediate", "Advance"] as const;
export const courseCategory = [
  "Development",
  "Design",
  "Marketing",
  "Business",
  "Data Science",
  "Personal Development",
  "Health Fitness",
  "Finance",
  "Music",
  "Language",
  "Lifestyle",
  "Photography",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),
  description: z
    .string()
    .min(20, "Description must be more detailed")
    .max(2000, "Description is too long"),
  smallDescription: z
    .string()
    .min(5, "Short description is required")
    .max(255, "Short description is too long"),
  fileKey: z.string().min(1, "File key is required"),
  price: z.coerce
    .number()
    .min(0, "Price must be at least 0")
    .max(1_000_000, "Price can't exceed 1,000,000"),
  duration: z.coerce
    .number()
    .int("Duration must be an integer")
    .min(1, "Minimum duration is 1 minute")
    .max(10_000, "Maximum duration is 10,000 minutes"),
  level: z.enum(courseLevel, {
    required_error: "Select a level",
  }),
  status: z.enum(courseStatus, {
    required_error: "Select a status",
  }),
  category: z.enum(courseCategory, {
    required_error: "Select a category",
  }),
  slug: z.string().min(1, "Slug is required").max(100, "Max 100 characters"),
});

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, "File name is required"),
  contentType: z.string().min(1, "Content type is required"),
  size: z.number().min(1, "File size must be greater than 0"),
  isImage: z.boolean(),
});

export const fileDeleteSchema = z.object({
  key: z.string().min(1, "S3 key is required"),
});

export const reorderChapterSchema = z.object({
  courseId: z.string(),
  chapters: z.array(
    z.object({
      id: z.string(),
      position: z.number(),
    })
  ),
});

export const reorderLessonSchema = z.object({
  courseId: z.string(),
  chapterId: z.string(),
  lessons: z.array(
    z.object({
      id: z.string(),
      position: z.number(),
    })
  ),
});
