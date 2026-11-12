"use client";

import { useMemo, useState } from "react";

export type RSVPRecord = {
  id: string;
  guest_name: string;
  email: string;
  phone: string | null;
  attendance: "accept" | "decline";
  message: string | null;
  allergies: string[];
  dietary_requirements: string | null;
  created_at: string;
};

type StatusTableProps = {
  invites: RSVPRecord[];
  errorMessage?: string;
  logoutAction: () => Promise<void>;
};

export default function StatusTable({
  invites,
  errorMessage,
  logoutAction,
}: StatusTableProps) {
  const [filter, setFilter] = useState<"all" | "accept" | "decline">("all");
  const [query, setQuery] = useState("");

  const accepted = invites.filter(({ attendance }) => attendance === "accept").length;
  const declined = invites.length - accepted;
  const filteredInvites = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return invites.filter((invite) => {
      const matchesFilter = filter === "all" || invite.attendance === filter;
      const searchableText = [
        invite.guest_name,
        invite.email,
        invite.phone ?? "",
        invite.message ?? "",
        invite.dietary_requirements ?? "",
        invite.allergies.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return matchesFilter && searchableText.includes(normalized);
    });
  }, [filter, invites, query]);

  return (
    <main className="status-page">
      <div className="status-dashboard">
        <header className="status-header">
          <div>
            <p className="eyebrow">Russelle &amp; Rosie · Wedding status</p>
            <h1 className="status-title serif">RSVP overview</h1>
          </div>
          <div className="status-header-actions">
            <a className="status-back-link" href="/">
              Back to invitation
            </a>
            <form action={logoutAction}>
              <button type="submit" className="status-logout">
                Sign out
              </button>
            </form>
          </div>
        </header>

        {errorMessage ? (
          <p className="status-error" role="alert">
            {errorMessage}
          </p>
        ) : (
          <>
            <section className="status-stats" aria-label="RSVP totals">
              <StatusStat label="Responses" value={invites.length} />
              <StatusStat label="Joyfully accepting" value={accepted} />
              <StatusStat label="Regretfully declining" value={declined} />
            </section>

            <section className="status-responses" aria-label="Guest responses">
              <div className="status-controls">
                <div className="status-filters" aria-label="Filter by response">
                  {(["all", "accept", "decline"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={filter === option}
                      onClick={() => setFilter(option)}
                      className={`status-filter ${filter === option ? "is-selected" : ""}`}
                    >
                      {option === "all"
                        ? "All"
                        : option === "accept"
                          ? "Accepted"
                          : "Declined"}
                    </button>
                  ))}
                </div>
                <label className="status-search-label">
                  <span className="sr-only">Search guest responses</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search guests, email, notes…"
                    className="status-search"
                  />
                </label>
              </div>

              <p className="status-result-count" aria-live="polite">
                Showing {filteredInvites.length} of {invites.length} responses
              </p>

              {filteredInvites.length === 0 ? (
                <div className="status-empty">
                  <p className="serif">
                    {invites.length === 0
                      ? "No responses yet"
                      : "No matching RSVPs"}
                  </p>
                  <span>
                    {invites.length === 0
                      ? "Guest replies will appear here."
                      : "Try another name or response filter."}
                  </span>
                </div>
              ) : (
                <div className="status-table-scroll">
                  <table className="status-table">
                    <thead>
                      <tr>
                        <th scope="col">Guest</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Response</th>
                        <th scope="col">Dietary &amp; allergies</th>
                        <th scope="col">Message</th>
                        <th scope="col">Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvites.map((invite) => {
                        const notes = [
                          ...invite.allergies,
                          invite.dietary_requirements,
                        ]
                          .filter(Boolean)
                          .join(", ");

                        return (
                          <tr key={invite.id}>
                            <th scope="row">{invite.guest_name}</th>
                            <td>
                              <a href={`mailto:${invite.email}`}>
                                {invite.email}
                              </a>
                            </td>
                            <td>{invite.phone || "—"}</td>
                            <td>
                              <span
                                className={`status-badge ${invite.attendance === "accept" ? "is-accepted" : "is-declined"}`}
                              >
                                {invite.attendance === "accept"
                                  ? "Accepts"
                                  : "Declines"}
                              </span>
                            </td>
                            <td>{notes || "—"}</td>
                            <td className="status-message">
                              {invite.message || "—"}
                            </td>
                            <td>
                              <time dateTime={invite.created_at}>
                                {invite.created_at.slice(0, 10)}
                              </time>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function StatusStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="status-stat">
      <p>{label}</p>
      <span>{value}</span>
    </div>
  );
}
