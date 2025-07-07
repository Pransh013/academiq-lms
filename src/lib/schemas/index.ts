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
