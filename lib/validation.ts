import { z } from "zod";

export const rsvpSchema = z.object({
  guestName: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z.string().trim().email("Please enter a valid email address.").max(254),
  phone: z.string().trim().max(40).optional().default(""),
  attendance: z.enum(["accept", "decline"]),
  message: z.string().trim().max(1000).optional().default(""),
  allergies: z.array(z.enum(["Seafood", "Peanuts", "Dairy", "Gluten"])).max(4).default([]),
  dietaryRequirements: z.string().trim().max(1000).optional().default(""),
  website: z.string().max(0).optional().default("")
});

export type RSVPInput = z.infer<typeof rsvpSchema>;
