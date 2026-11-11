import StatusTable, { type RSVPRecord } from "@/components/StatusTable";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

async function getInviteStatuses(): Promise<RSVPRecord[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return [];
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as RSVPRecord[];
  } catch (error) {
    console.error("Failed to load RSVP statuses:", error);
    return [];
  }
}

export default async function StatusPage() {
  const invites = await getInviteStatuses();
  return <StatusTable invites={invites} />;
}
