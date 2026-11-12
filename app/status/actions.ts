"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createStatusSession,
  isStatusAuthConfigured,
  STATUS_COOKIE_NAME,
  STATUS_SESSION_DURATION_SECONDS,
  verifyStatusPassword,
} from "@/lib/status-auth";

export async function loginToStatus(formData: FormData) {
  if (!isStatusAuthConfigured()) {
    redirect("/status?error=configuration");
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !verifyStatusPassword(password)) {
    redirect("/status?error=invalid");
  }

  const session = createStatusSession();
  const cookieStore = await cookies();
  cookieStore.set(STATUS_COOKIE_NAME, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/status",
    maxAge: STATUS_SESSION_DURATION_SECONDS,
    expires: new Date(session.expiresAt * 1000),
  });

  redirect("/status");
}

export async function logoutFromStatus() {
  const cookieStore = await cookies();
  cookieStore.delete(STATUS_COOKIE_NAME);
  redirect("/status");
}
