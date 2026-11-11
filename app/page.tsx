import Link from "next/link";
import InvitationScene from "@/components/InvitationScene";

export default function Home() {
  return (
    <>
      <InvitationScene />
      <div className="flex justify-center pb-8">
        <Link
          href="/status"
          className="inline-flex items-center justify-center rounded-full border border-[#d7c4b9] bg-white/80 px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#4c433d] transition hover:border-[#c77d62] hover:text-[#c77d62]"
        >
          View RSVP status
        </Link>
      </div>
    </>
  );
}
