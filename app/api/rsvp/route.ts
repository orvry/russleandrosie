import { NextRequest, NextResponse } from "next/server";
import { rsvpSchema } from "@/lib/validation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const appOrigin = process.env.APP_ORIGIN;
    const origin = request.headers.get("origin");

    if (appOrigin && origin && new URL(origin).origin !== new URL(appOrigin).origin) {
      return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
    }

    const body: unknown = await request.json();
    const parsed = rsvpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check your details and try again.", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Honeypot: bots that fill this hidden field receive a generic success response.
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("rsvps").insert({
      guest_name: parsed.data.guestName,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      attendance: parsed.data.attendance,
      message: parsed.data.message || null,
      allergies: parsed.data.allergies,
      dietary_requirements: parsed.data.dietaryRequirements || null
    });

    if (error) {
      console.error("RSVP insert failed:", error.message);
      return NextResponse.json({ error: "We couldn't save your response. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("RSVP request failed:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again shortly." }, { status: 500 });
  }
}
