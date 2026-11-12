"use client";

import Image from "next/image";
import { type FormEvent, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const allergyOptions = ["Seafood", "Peanuts", "Dairy", "Gluten"] as const;

const chapters = [
  {
    number: "01",
    title: "It began with hello.",
    date: "February 21, 2027",
    releaseDate: "2027-02-21",
    teaser: "A chance meeting. A conversation that lingered.",
    story:
      "A chance hello turned into a conversation neither of us wanted to end. We didn't know it yet, but our story had found its first page.",
    marker: "The beginning",
  },
  {
    number: "02",
    title: "A thousand small things.",
    date: "February 28, 2027",
    releaseDate: "2027-02-28",
    teaser: "Slow Sundays, shared plates, and a place to call ours.",
    story:
      "Somehow, the little things became the big things: familiar songs, one more cup of coffee, and the comfort of being exactly where we belong.",
    marker: "The everyday",
  },
  {
    number: "03",
    title: "A promise, kept.",
    date: "March 7, 2027",
    releaseDate: "2027-03-07",
    teaser: "One question. Two very happy hearts.",
    story:
      "There was a question, a joyful yes, and a promise to keep choosing one another through every season still to come.",
    marker: "The promise",
  },
  {
    number: "04",
    title: "All our favorite people.",
    date: "March 14, 2027",
    releaseDate: "2027-03-14",
    teaser: "The next page is better because you're in it.",
    story:
      "Now we get to bring all our favorite people into the same room, gather close, and begin the next chapter together.",
    marker: "The gathering",
  },
] as const;

export default function InvitationScene() {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [attendance, setAttendance] = useState<"accept" | "decline" | "">("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const flowerY = useTransform(scrollYProgress, [0, 1], ["0%", "13%"]);
  const flowerRotate = useTransform(scrollYProgress, [0, 1], [0, -7]);

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

  const reveal = reduceMotion
    ? { duration: 0 }
    : { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <main className="story-site">
      <header className="story-nav">
        <a className="wordmark" href="#top" aria-label="Russelle and Rosie, home">
          <span className="wordmark-monogram">R<span>&amp;</span>R</span>
          <span className="wordmark-caption">A day in the garden</span>
        </a>
        <nav aria-label="Story navigation">
          <a href="#chapter-01">Our story</a>
          <a href="#wedding-day">The wedding</a>
          <a className="nav-rsvp" href="#rsvp">RSVP <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <section
        id="top"
        ref={heroRef}
        className="story-hero"
        aria-labelledby="hero-title"
      >
        <div className="hero-wash" aria-hidden="true" />
        <motion.div
          className="hero-photo"
          style={reduceMotion ? undefined : { y: flowerY, rotate: flowerRotate }}
        >
          <Image
            src="/angels-breath.jpg"
            alt="Airy clusters of white angel's-breath flowers"
            fill
            priority
            sizes="(max-width: 760px) 90vw, 48vw"
            className="hero-photo-image"
          />
          <span className="photo-caption">
            Gypsophila <span>—</span> angel’s breath
          </span>
        </motion.div>
        <div className="hero-copy">
          <p className="eyebrow">The story of Russelle &amp; Rosie</p>
          <h1 id="hero-title" className="hero-title">
            A love
            <br />
            in <em>bloom.</em>
          </h1>
          <p className="hero-deck">
            Little by little, day by day, our story grew into a life we can’t
            wait to celebrate with you.
          </p>
          <a href="#chapter-01" className="story-link">
            Follow our story <span aria-hidden="true">↓</span>
          </a>
        </div>
        <motion.div
          className="hero-sprig"
          aria-hidden="true"
          style={
            reduceMotion
              ? undefined
              : { y: flowerY, rotate: flowerRotate }
          }
        >
          <AngelBreathSprig />
        </motion.div>
        <div className="hero-bottomline">
          <span>Four Sunday chapters</span>
          <span>March 21, 2027</span>
          <span>Scroll to wander ↓</span>
        </div>
      </section>

      <section className="story-intro" aria-label="Our story">
        <p className="eyebrow">A little, lovely timeline</p>
        <h2 className="intro-statement">
          Some things grow
          <br />
          <em>beautifully</em> slowly.
        </h2>
        <AngelBreathSprig className="intro-sprig" />
        <p className="intro-caption">
          One chapter each Sunday, beginning one month before we say “I do.”
        </p>
      </section>

      <div className="chapter-stack">
        {chapters.map((chapter, index) => {
          const isReleased =
            Date.now() >=
            new Date(`${chapter.releaseDate}T00:00:00`).getTime();

          return (
            <motion.section
              id={`chapter-${chapter.number}`}
              key={chapter.number}
              className={`story-chapter story-chapter-${index + 1}`}
              aria-labelledby={`chapter-title-${chapter.number}`}
              initial={reduceMotion ? false : { opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={reveal}
            >
              <div className="chapter-watermark" aria-hidden="true">
                {chapter.number}
              </div>
              <div className="chapter-copy">
                <p className="chapter-kicker">
                  <span>{chapter.marker}</span>
                  <span className="chapter-rule" />
                  <span>Chapter {chapter.number}</span>
                </p>
                <h2
                  id={`chapter-title-${chapter.number}`}
                  className="chapter-heading"
                >
                  {chapter.title}
                </h2>
                <p className="chapter-story">
                  {isReleased ? chapter.story : chapter.teaser}
                </p>
                <p className="chapter-release">
                  {isReleased ? (
                    <>In bloom now <span aria-hidden="true">✳</span></>
                  ) : (
                    <>Opens {chapter.date}</>
                  )}
                </p>
              </div>
              <div className="chapter-botanical" aria-hidden="true">
                <AngelBreathSprig />
                <span className="chapter-seed">{chapter.number}</span>
              </div>
              <span className="chapter-edge-label" aria-hidden="true">
                R + R <span>·</span> 2027
              </span>
            </motion.section>
          );
        })}
      </div>

      <section
        id="wedding-day"
        className="wedding-finale"
        aria-labelledby="wedding-title"
      >
        <div className="finale-backdrop" aria-hidden="true" />
        <div className="finale-flower" aria-hidden="true">
          <AngelBreathSprig />
        </div>
        <div className="finale-heading">
          <p className="eyebrow">The next chapter starts here</p>
          <h2 id="wedding-title" className="finale-title">
            And then,
            <br />
            <em>we do.</em>
          </h2>
          <p className="finale-copy">
            We’d love for you to be there when our garden of two becomes a
            gathering of everyone we love.
          </p>
        </div>

        <div className="wedding-details">
          <p className="eyebrow">Please join us</p>
          <p className="wedding-date">March <strong>21</strong>, 2027</p>
          <div className="detail-strip">
            <div>
              <span className="detail-key">When</span>
              <span className="detail-answer">Sunday · 3:00 PM</span>
            </div>
            <div>
              <span className="detail-key">Where</span>
              <span className="detail-answer">Quezon City, Philippines</span>
            </div>
          </div>

          <div id="rsvp" className="rsvp-card">
            <button
              type="button"
              className="rsvp-toggle"
              aria-expanded={isRsvpOpen}
              aria-controls="rsvp-form-panel"
              onClick={() => setIsRsvpOpen((open) => !open)}
            >
              <span>
                <span className="rsvp-label">Kindly reply</span>
                <span className="rsvp-title serif">Save your place</span>
              </span>
              <span className="rsvp-icon" aria-hidden="true">
                {isRsvpOpen ? "−" : "+"}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isRsvpOpen && (
                <motion.div
                  id="rsvp-form-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.35 }}
                  className="rsvp-panel"
                >
                  {status === "success" ? (
                    <div className="rsvp-success" role="status">
                      <p className="serif">We saved you a seat.</p>
                      <span>Thank you for being part of our story.</span>
                    </div>
                  ) : (
                    <form onSubmit={submitRSVP} className="rsvp-form">
                      <Field
                        label="Guest name"
                        name="guestName"
                        placeholder="Your full name"
                        required
                        maxLength={120}
                      />
                      <Field
                        label="Email address"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        maxLength={254}
                      />
                      <Field
                        label="Mobile number"
                        name="phone"
                        type="tel"
                        placeholder="Optional"
                        maxLength={40}
                      />
                      <fieldset className="attendance-fieldset">
                        <legend className="field-label">Will you join us?</legend>
                        <div className="attendance-options">
                          {(["accept", "decline"] as const).map((value) => (
                            <button
                              key={value}
                              type="button"
                              aria-pressed={attendance === value}
                              onClick={() => setAttendance(value)}
                              className={`attendance-button ${attendance === value ? "is-selected" : ""}`}
                            >
                              {value === "accept"
                                ? "Joyfully accept"
                                : "Regretfully decline"}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                      <fieldset>
                        <legend className="field-label">Food allergies</legend>
                        <div className="allergy-options">
                          {allergyOptions.map((item) => {
                            const selected = allergies.includes(item);
                            return (
                              <button
                                key={item}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => toggleAllergy(item)}
                                className={`allergy-button ${selected ? "is-selected" : ""}`}
                              >
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>
                      <div>
                        <label className="field-label" htmlFor="dietaryRequirements">
                          Dietary notes
                        </label>
                        <textarea
                          id="dietaryRequirements"
                          name="dietaryRequirements"
                          className="form-field"
                          rows={2}
                          maxLength={1000}
                          placeholder="Anything we should know?"
                        />
                      </div>
                      <div>
                        <label className="field-label" htmlFor="message">
                          A note for the couple
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          className="form-field"
                          rows={3}
                          maxLength={1000}
                          placeholder="We’d love to hear from you."
                        />
                      </div>
                      <div className="honeypot" aria-hidden="true">
                        <label htmlFor="website">Leave this field empty</label>
                        <input
                          id="website"
                          name="website"
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>
                      {status === "error" && (
                        <p role="alert" className="form-error">
                          {errorMessage}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="rsvp-submit"
                      >
                        {status === "sending"
                          ? "Sending your reply…"
                          : "Send your reply"}
                      </button>
                      <p className="form-note">
                        Your reply will be shared with the couple for wedding
                        planning.
                      </p>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <footer className="story-footer">
          <span>With love, Russelle &amp; Rosie</span>
          <a
            href="https://unsplash.com/photos/a-close-up-of-white-flowers-aGUchWKVBmk"
            target="_blank"
            rel="noreferrer"
          >
            Angel’s breath photograph by Tanya Chanova · Unsplash
          </a>
        </footer>
      </section>
    </main>
  );
}

function AngelBreathSprig({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`angel-sprig ${className}`}
      viewBox="0 0 260 360"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="2">
        <path d="M130 350c-5-81 17-153 8-232M132 298c-31-40-66-57-99-81M134 278c30-44 66-65 108-88M137 226c-17-35-43-60-72-80M139 203c24-35 47-54 76-68M136 167c-5-26-13-49-25-72M133 132c18-21 29-40 35-61M132 308c-26-12-47-15-72-14M139 264c30-9 49-9 75-4" />
      </g>
      <g fill="currentColor">
        <circle cx="30" cy="210" r="8" />
        <circle cx="19" cy="204" r="5" />
        <circle cx="35" cy="197" r="5" />
        <circle cx="42" cy="215" r="5" />
        <circle cx="238" cy="189" r="8" />
        <circle cx="226" cy="183" r="5" />
        <circle cx="244" cy="176" r="5" />
        <circle cx="250" cy="193" r="5" />
        <circle cx="64" cy="140" r="7" />
        <circle cx="54" cy="134" r="4.5" />
        <circle cx="70" cy="129" r="4.5" />
        <circle cx="76" cy="145" r="4.5" />
        <circle cx="215" cy="134" r="7" />
        <circle cx="205" cy="128" r="4.5" />
        <circle cx="220" cy="123" r="4.5" />
        <circle cx="227" cy="140" r="4.5" />
        <circle cx="111" cy="94" r="7" />
        <circle cx="101" cy="88" r="4.5" />
        <circle cx="117" cy="83" r="4.5" />
        <circle cx="123" cy="99" r="4.5" />
        <circle cx="168" cy="69" r="7" />
        <circle cx="158" cy="63" r="4.5" />
        <circle cx="174" cy="58" r="4.5" />
        <circle cx="180" cy="74" r="4.5" />
        <circle cx="60" cy="294" r="6" />
        <circle cx="51" cy="288" r="4" />
        <circle cx="66" cy="283" r="4" />
        <circle cx="73" cy="299" r="4" />
        <circle cx="215" cy="260" r="6" />
        <circle cx="206" cy="254" r="4" />
        <circle cx="221" cy="249" r="4" />
        <circle cx="228" cy="265" r="4" />
      </g>
    </svg>
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
        {required && <span className="required-mark"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="form-field"
      />
    </div>
  );
}
