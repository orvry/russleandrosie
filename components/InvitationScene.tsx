"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const allergyOptions = ["Seafood", "Peanuts", "Dairy", "Gluten"] as const;

export default function InvitationScene() {
  const [isOpen, setIsOpen] = useState(false);
  const [attendance, setAttendance] = useState<"accept" | "decline" | "">("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const reduceMotion = useReducedMotion();

  function toggleAllergy(item: string) {
    setAllergies((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item],
    );
  }

  async function submitRSVP(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const form = new FormData(event.currentTarget);
    const payload = {
      guestName: String(form.get("guestName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      attendance,
      message: String(form.get("message") || ""),
      allergies,
      dietaryRequirements: String(form.get("dietaryRequirements") || ""),
      website: String(form.get("website") || ""),
    };

    if (!attendance) {
      setStatus("error");
      setErrorMessage("Please select your attendance response.");
      return;
    }

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(result.error || "Unable to submit your response.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Connection problem. Please check your internet and try again.",
      );
    }
  }

  const spring = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 110, damping: 19 };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F3F0ED] px-4 py-8 sm:px-6 sm:py-12">
      <div className="absolute inset-0 paper-grain opacity-40" />
      <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-[#fffdfb] via-[#fffdfb]/80 to-transparent" />
      <div className="soft-blush left-[10%] top-12" />
      <div className="soft-blush right-[12%] bottom-14" />
      <span aria-hidden className="leaf-mark left-4 top-8 rotate-[-18deg]" />
      <span aria-hidden className="leaf-mark right-5 top-16 rotate-[18deg]" />
      <span aria-hidden className="leaf-mark left-10 bottom-10 rotate-[28deg] scale-110" />

      <div className="relative z-10 mx-auto w-full max-w-[700px]">
        <motion.section
          animate={{ y: isOpen ? -20 : 0, rotate: isOpen ? -0.12 : 0 }}
          transition={spring}
          className="invitation-frame relative z-20 overflow-hidden px-5 py-6 text-center sm:px-9 sm:py-7"
        >
          <div className="relative">
            <p className="text-[8px] uppercase tracking-[0.32em] text-[#7D8F74]">
              Together with our families
            </p>

            <div className="mx-auto my-4 h-px w-16 bg-[#cfc3ba]" />

            <div className="serif mt-2 text-[#1F1B1A]">
              <span className="block text-[3.2rem] italic leading-[0.9] tracking-[-.07em] sm:text-[4.8rem]">
                Russle
              </span>
              <span className="my-1 block text-[1.7rem] leading-none text-[#B77F71] sm:text-[2.1rem]">
                &amp;
              </span>
              <span className="block text-[3.2rem] italic leading-[0.9] tracking-[-.07em] sm:text-[4.8rem]">
                Rosie
              </span>
            </div>

            <div className="mx-auto my-4 h-px w-16 bg-[#cfc3ba]" />

            <p className="serif text-[1.7rem] leading-[1] text-[#1F1B1A] sm:text-[2.1rem]">
              Request the pleasure of your company
            </p>
            <p className="mt-2 text-[11px] leading-5 text-[#6E625B] sm:text-[12px]">
              as we celebrate our wedding day and share this moment of love.
            </p>

            <div className="mt-6 grid gap-2.5 text-left sm:grid-cols-3">
              <div className="detail-card">
                <p className="detail-label">Date</p>
                <p className="detail-value">March 21</p>
                <p className="detail-meta">2027</p>
              </div>
              <div className="detail-card">
                <p className="detail-label">Ceremony</p>
                <p className="detail-value">3:00 PM</p>
                <p className="detail-meta">Garden Vows</p>
              </div>
              <div className="detail-card">
                <p className="detail-label">Venue</p>
                <p className="detail-value">Quezon City</p>
                <p className="detail-meta">Philippines</p>
              </div>
            </div>

            <p className="mt-6 text-[8px] uppercase tracking-[0.22em] text-[#8A7D73]">
              Join us for a day of love, laughter and celebration
            </p>
          </div>
        </motion.section>

        <motion.section
          animate={{ y: isOpen ? 0 : -8 }}
          transition={spring}
          className="response-frame relative z-10 -mt-4 overflow-hidden"
        >
          <div className="mx-auto mt-4 h-px w-16 bg-[#cfc3ba]" />
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="rsvp-form-panel"
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-[86px] w-full flex-col items-center justify-center text-[#4C433D] transition-colors hover:bg-[#EFE1D8]"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#7D8F74]">
              RSVP
            </span>
            <span className="serif mt-1 text-[1.8rem] italic leading-none sm:text-[2.2rem]">
              {isOpen ? "Close" : "Open"}
            </span>
          </button>
          <div className="mx-auto mb-4 h-px w-16 bg-[#cfc3ba]" />

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                id="rsvp-form-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.35 }}
                className="overflow-hidden rounded-b-[30px]"
              >
                <div className="mx-6 h-px bg-[#C89D92]" />
                {status === "success" ? (
                  <div className="px-7 py-12 text-center" role="status">
                    <span className="serif text-5xl text-[#7D8F74]">
                      Thank you
                    </span>
                    <p className="serif mt-3 text-2xl text-[#4C433D]">
                      Your response has been received.
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[#6E625B]">
                      We are grateful to have you as part of our story. We look
                      forward to celebrating together.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={submitRSVP}
                    className="space-y-5 px-6 pb-8 pt-7 sm:px-8"
                    noValidate={false}
                  >
                    <div className="text-center">
                      <div className="floral-divider text-[#B77F71]">✦</div>
                      <h1 className="serif mt-3 text-4xl text-[#4C433D]">
                        Kindly Respond
                      </h1>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#7D8F74]">
                        Please share your response with us
                      </p>
                    </div>

                    <Field
                      label="Guest Name"
                      name="guestName"
                      placeholder="Your full name"
                      required
                      maxLength={120}
                    />
                    <Field
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      maxLength={254}
                    />
                    <Field
                      label="Mobile Number"
                      name="phone"
                      type="tel"
                      placeholder="Your mobile number (optional)"
                      maxLength={40}
                    />

                    <fieldset>
                      <legend className="field-label">
                        Attendance{" "}
                        <span className="normal-case tracking-normal text-[#A18F82]">
                          (required)
                        </span>
                      </legend>
                      <div className="grid grid-cols-2 rounded-full border border-[#E3D2C5] bg-[#F7F0EA] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.8)]">
                        {(["accept", "decline"] as const).map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setAttendance(value)}
                            className={`relative rounded-full px-2 py-3 text-[11px] transition-colors ${attendance === value ? "text-white" : "text-[#4C433D]"}`}
                          >
                            {attendance === value && (
                              <motion.span
                                layoutId="attendance-pill"
                                className={`absolute inset-0 rounded-full ${value === "accept" ? "bg-[#7D8F74]" : "bg-[#B77F71]"}`}
                                transition={{
                                  type: "spring",
                                  stiffness: 350,
                                  damping: 30,
                                }}
                              />
                            )}
                            <span className="relative z-10">
                              {value === "accept"
                                ? "Joyfully Accept"
                                : "Regretfully Decline"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset>
                      <legend className="field-label">Food Allergies</legend>
                      <div className="flex flex-wrap gap-2">
                        {allergyOptions.map((item) => {
                          const selected = allergies.includes(item);
                          return (
                            <motion.button
                              key={item}
                              type="button"
                              whileTap={
                                reduceMotion ? undefined : { scale: 0.96 }
                              }
                              onClick={() => toggleAllergy(item)}
                              aria-pressed={selected}
                              className={`rounded-full border px-4 py-2 text-xs transition-colors ${selected ? "border-[#7D8F74] bg-[#7D8F74] text-white shadow-[0_8px_18px_rgba(125,143,116,.18)]" : "border-[#E3D2C5] bg-[#FFFDFB] text-[#4C433D]"}`}
                            >
                              {selected ? "✓ " : ""}
                              {item}
                            </motion.button>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div>
                      <label
                        className="field-label"
                        htmlFor="dietaryRequirements"
                      >
                        Other Dietary Requirements
                      </label>
                      <textarea
                        id="dietaryRequirements"
                        name="dietaryRequirements"
                        className="field"
                        rows={2}
                        maxLength={1000}
                        placeholder="Please let us know..."
                      />
                    </div>
                    <div>
                      <label className="field-label" htmlFor="message">
                        Message to the Couple
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className="field"
                        rows={3}
                        maxLength={1000}
                        placeholder="Write us a little note..."
                      />
                    </div>

                    <div
                      className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
                      aria-hidden="true"
                    >
                      <label htmlFor="website">Leave this field empty</label>
                      <input
                        id="website"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    {status === "error" && (
                      <p role="alert" className="text-sm text-[#A34F43]">
                        {errorMessage}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full rounded-full bg-[#7D8F74] px-5 py-4 text-[10px] font-medium uppercase tracking-[0.2em] text-white shadow-[0_12px_25px_rgba(125,143,116,.22)] transition-all duration-200 hover:bg-[#6B7A65] hover:shadow-[0_14px_28px_rgba(107,122,101,.26)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === "sending"
                        ? "Sending your response..."
                        : "Send your response"}
                    </button>
                    <p className="text-center text-[10px] leading-5 text-[#8A7D73]">
                      Your response will be shared with the couple for wedding
                      planning.
                    </p>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <p className="mt-8 text-center text-[10px] tracking-[0.12em] text-[#9B8D82]">
          WITH LOVE · RUSSLE &amp; ROSIE · 2027
        </p>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
  maxLength,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  maxLength: number;
}) {
  return (
    <div>
      <label className="field-label" htmlFor={name}>
        {label}
        {required && <span className="ml-1 text-[#C89D92]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="field"
      />
    </div>
  );
}
