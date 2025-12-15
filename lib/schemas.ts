import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Нууц үг дор хаяж 6 тэмдэгт байх ёстой")
    .regex(/[A-Z]/, "Том үсэг /A, B, C .../ агуулах ёстой")
    .regex(/[a-z]/, "Жижиг үсэг /a, b, c .../ агуулах ёстой")
    .regex(/[^A-Za-z0-9]/, "Тусгай тэмдэгт /@, #, $ .../ агуулах ёстой"),
  name: z.string().min(1, "Name is required"),
});

export const CourseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  fakeEnrollmentBonus: z.coerce.number().min(0, "Bonus must be non-negative"),
  isPublished: z.boolean().default(false),
  thumbnailUrl: z.string().optional(),
});

export const EpisodeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  order: z.coerce.number().default(0),
  isFreePreview: z.boolean().default(false),
  videoUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
});
