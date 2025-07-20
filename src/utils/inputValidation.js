import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const signUpSchema = z.object({
  fullName: z.string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be less than 50 characters"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
  avatar: z.instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, "Max image size is 5MB")
    .refine(
      file => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Only .jpg, .png, and .webp formats are supported"
    )
});

export const loginSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and underscores"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});