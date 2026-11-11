"use client";

import Link from "next/link";
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

export default function StatusTable({ invites }: { invites: RSVPRecord[] }) {
  const total = invites.length;
  const accepted = invites.filter(({ attendance }) => attendance === "accept").length;
  const declined = invites.filter(({ attendance }) => attendance === "decline").length;

  const [filter, setFilter] = useState<"all" | "accept" | "decline">("all");
  const [query, setQuery] = useState("");

  const filteredInvites = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return invites.filter((invite) => {
      const matchesFilter = filter === "all" ? true : invite.attendance === filter;
      const matchesQuery =
        normalized.length === 0 ||
        [
          invite.guest_name,
          invite.email,
          invite.phone ?? "",
          invite.message ?? "",
          invite.dietary_requirements ?? "",
          invite.allergies.join(" ")
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized);

      return matchesFilter && matchesQuery;
    });
  }, [filter, invites, query]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.84),_transparent_28%),linear-gradient(180deg,_#f2ece5_0%,_#f7f3ee_100%)] px-4 py-10 text-[#4c433d] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.28em] text-[#7d8f74]">
              Wedding status
            </p>
            <h1 className="font-serif text-5xl leading-none text-[#4c433d] sm:text-6xl">
              RSVP overview
            </h1>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-[#d9c9bd] bg-white/80 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#4c433d] transition hover:border-[#c77d62] hover:text-[#c77d62]"
          >
            Back to invite
          </Link>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.6rem] border border-[#e6d8d0] bg-[#f8f3ef] p-5 shadow-[0_14px_34px_rgba(64,53,49,0.04)]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#7a736f]">Responded</p>
            <p className="mt-3 font-serif text-4xl text-[#4c433d]">{total}</p>
          </div>

          <div className="rounded-[1.6rem] border border-[#e6d8d0] bg-[#f8f3ef] p-5 shadow-[0_14px_34px_rgba(64,53,49,0.04)]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#7a736f]">Accepted</p>
            <p className="mt-3 font-serif text-4xl text-[#7d8f74]">{accepted}</p>
          </div>

          <div className="rounded-[1.6rem] border border-[#e6d8d0] bg-[#f8f3ef] p-5 shadow-[0_14px_34px_rgba(64,53,49,0.04)]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#7a736f]">Declined</p>
            <p className="mt-3 font-serif text-4xl text-[#c77d62]">{declined}</p>
          </div>
        </section>

        <section className="mt-8 rounded-[1.8rem] border border-[#e6d8d0] bg-white/80 p-4 shadow-[0_18px_38px_rgba(40,35,32,0.05)]">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {(["all", "accept", "decline"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`rounded-full px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] transition ${
                    filter === option
                      ? "bg-[#4c433d] text-white"
                      : "border border-[#dccac0] bg-[#f9f4f1] text-[#5f5a57] hover:border-[#c77d62] hover:text-[#c77d62]"
                  }`}
                >
                  {option === "all" ? "All" : option === "accept" ? "Accepted" : "Declined"}
                </button>
              ))}
            </div>

            <label className="relative block w-full max-w-sm">
              <span className="sr-only">Search guests</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search guest, email, notes..."
                className="w-full rounded-full border border-[#dccac0] bg-[#f9f4f1] px-4 py-2.5 text-sm text-[#4c433d] placeholder:text-[#9c918a] focus:border-[#7d8f74] focus:outline-none focus:ring-2 focus:ring-[#b9c7af]"
              />
            </label>
          </div>

          <div className="mb-3 text-[10px] uppercase tracking-[0.18em] text-[#7a736f]">
            Showing {filteredInvites.length} of {invites.length} responses
          </div>

          {!filteredInvites.length ? (
            <div className="rounded-[1.6rem] border border-dashed border-[#d5c5bd] bg-[#faf6f4] p-10 text-center">
              <p className="font-serif text-3xl text-[#4c433d]">No matching RSVPs</p>
              <p className="mt-2 text-sm text-[#5f5a57]">Try another guest name or status filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm text-[#5f5a57]">
                <thead className="bg-[#f7f0eb] text-[10px] uppercase tracking-[0.18em] text-[#7a736f]">
                  <tr>
                    <th className="px-4 py-3">Guest</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Dietary notes</th>
                    <th className="px-4 py-3">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvites.map((invite) => {
                    const isAccepted = invite.attendance === "accept";
                    const details =
                      invite.dietary_requirements ||
                      (invite.allergies.length ? invite.allergies.join(", ") : "—");

                    return (
                      <tr key={invite.id} className="border-t border-[#efe3dc] align-top">
                        <td className="px-4 py-4">
                          <div className="font-serif text-2xl leading-none text-[#4c433d]">
                            {invite.guest_name}
                          </div>
                        </td>
                        <td className="px-4 py-4">{invite.email}</td>
                        <td className="px-4 py-4">{invite.phone || "—"}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] ${
                              isAccepted
                                ? "bg-[#edf3e8] text-[#62705e]"
                                : "bg-[#f6e8e2] text-[#a86e5c]"
                            }`}
                          >
                            {isAccepted ? "Accepts" : "Declines"}
                          </span>
                        </td>
                        <td className="px-4 py-4">{details}</td>
                        <td className="px-4 py-4 text-[#4c433d]">
                          {invite.message || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
