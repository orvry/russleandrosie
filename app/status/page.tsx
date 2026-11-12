import Link from "next/link";
import { cookies } from "next/headers";
import { loginToStatus, logoutFromStatus } from "./actions";
import StatusTable, { type RSVPRecord } from "@/components/StatusTable";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  isStatusAuthConfigured,
  isValidStatusSession,
  STATUS_COOKIE_NAME,
} from "@/lib/status-auth";

export const dynamic = "force-dynamic";

type StatusPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function StatusPage({ searchParams }: StatusPageProps) {
  const { error } = await searchParams;

  if (!isStatusAuthConfigured()) {
    return (
      <main className="status-page">
        <section className="status-message-card" aria-labelledby="status-title">
          <p className="eyebrow">Russelle &amp; Rosie</p>
          <h1 id="status-title" className="status-title serif">
            Status page setup
          </h1>
          <p>
            Add <code>RSVP_STATUS_PASSWORD</code> (at least 12 characters) and{" "}
            <code>RSVP_STATUS_SESSION_SECRET</code> (at least 32 characters) to
            the server environment to protect this page.
          </p>
          <Link className="status-back-link" href="/">
            Back to the invitation
          </Link>
        </section>
      </main>
    );
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(STATUS_COOKIE_NAME)?.value;

  if (!isValidStatusSession(session)) {
    return (
      <main className="status-page">
        <section className="status-login-card" aria-labelledby="status-title">
          <p className="eyebrow">Russelle &amp; Rosie · Wedding status</p>
          <h1 id="status-title" className="status-title serif">
            RSVP overview
          </h1>
          <p className="status-intro">
            Sign in to view guest responses and planning notes.
          </p>
          <form action={loginToStatus} className="status-login-form">
            <label htmlFor="status-password" className="field-label">
              Admin password
            </label>
            <input
              id="status-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="form-field"
            />
            {error === "invalid" && (
              <p className="form-error" role="alert">
                That password didn’t match. Please try again.
              </p>
            )}
            {error === "configuration" && (
              <p className="form-error" role="alert">
                Status page authentication is not configured on the server.
              </p>
            )}
            <button type="submit" className="status-button">
              Open RSVP status
            </button>
          </form>
          <Link className="status-back-link" href="/">
            Back to the invitation
          </Link>
        </section>
      </main>
    );
  }

  let invites: RSVPRecord[] = [];
  let loadError: string | undefined;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error: queryError } = await supabase
      .from("rsvps")
      .select(
        "id, guest_name, email, phone, attendance, message, allergies, dietary_requirements, created_at",
      )
      .returns<RSVPRecord[]>()
      .order("created_at", { ascending: false });

    if (queryError) {
      console.error("Failed to load RSVP statuses:", queryError.message);
      loadError = "We couldn’t load RSVP responses. Please try again later.";
    } else {
      invites = data ?? [];
    }
  } catch (caughtError) {
    console.error("Failed to load RSVP statuses:", caughtError);
    loadError = "We couldn’t connect to the RSVP database. Check the server configuration.";
  }

  return (
    <StatusTable
      invites={invites}
      errorMessage={loadError}
      logoutAction={logoutFromStatus}
    />
  );
}
