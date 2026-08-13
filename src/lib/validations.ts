import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const wasteTypes = [
  "General",
  "Recyclable",
  "Organic",
  "Hazardous",
] as const;

export const createRequestSchema = z.object({
  address: z.string().trim().min(5, "Address is required"),
  wasteType: z.enum(wasteTypes, { message: "Select a waste type" }),
  preferredDate: z.string().min(1, "Preferred date is required"),
  description: z.string().trim().min(3, "Description is required"),
}).superRefine((data, ctx) => {
  const date = new Date(data.preferredDate);
  if (Number.isNaN(date.getTime())) {
    ctx.addIssue({
      code: "custom",
      path: ["preferredDate"],
      message: "Enter a valid date",
    });
    return;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const preferred = new Date(date);
  preferred.setHours(0, 0, 0, 0);
  if (preferred < today) {
    ctx.addIssue({
      code: "custom",
      path: ["preferredDate"],
      message: "Preferred date cannot be in the past",
    });
  }
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().optional(),
});

export const collectorSchema = z.object({
  name: z.string().trim().min(2, "Collector name is required"),
  phone: z.string().trim().min(8, "Enter a valid phone number"),
  area: z.string().trim().min(2, "Service area is required"),
});

export const adminUpdateSchema = z.object({
  collectorId: z.string().trim().min(1, "Select a collector").optional(),
  status: z
    .enum(["PENDING", "ASSIGNED", "IN_PROGRESS", "COLLECTED", "CANCELLED"])
    .optional(),
});
