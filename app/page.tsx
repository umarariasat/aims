"use client";

import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

/* ---------- Brand tokens ----------
   navy #183B56 · ink #102A43 · body #526174 · link #2E6DA4
   sky  #6FA8DC (decorative) · mist #F8FBFF · pale #E7F2FA
------------------------------------ */

const display = "font-[family-name:var(--font-cormorant)]";
const container = "mx-auto max-w-7xl px-6 sm:px-8 lg:px-14";
const focus =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E6DA4]";

const FULL_NAME = "Ali International Muhammadon School";
const WHATSAPP_NUMBER = "923006262348";
const PHONE_DISPLAY = "+92 300 6262348";
const EMAIL = "hello@aimhighschool.com";
const SLIDE_SECONDS = 7;

const schoolSchema = {
  "@context": "https://schema.org",
  "@type": "School",
  name: FULL_NAME,
  alternateName: ["Aim High School", "AIMS"],
  foundingDate: "2007",
  founder: { "@type": "Person", name: "Muhammad Sajid" },
  telephone: "+92 300 6262348",
  email: "hello@aimhighschool.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jalalpur Jattan Road",
    addressLocality: "Gujrat",
    addressRegion: "Punjab",
    addressCountry: "PK",
  },
};

const navLinks = [
  { label: "Our story", href: "#story", id: "story" },
  { label: "Academics", href: "#academics", id: "academics" },
  { label: "Student life", href: "#life", id: "life" },
  { label: "Alumni", href: "#alumni", id: "alumni" },
  { label: "Contact", href: "#contact", id: "contact" },
];

const slides = [
  {
    image: "/images/school3.png",
    label: "Welcome",
    line1: "Where young",
    line2: "minds begin.",
    description:
      "A thoughtful beginning where curiosity is nurtured, confidence takes root, and every child is given room to discover who they can become.",
  },
  {
    image: "/images/school1.png",
    label: "Learning",
    line1: "Think beyond",
    line2: "the expected.",
    description:
      "We turn questions into possibilities, giving students the freedom to explore ideas, challenge assumptions, and find their own way forward.",
  },
  {
    image: "/images/school2.png",
    label: "Life at school",
    line1: "Find your",
    line2: "place to belong.",
    description:
      "More than a school community — a place where friendships grow, individuality is celebrated, and every student has a story worth telling.",
  },
];

const values = [
  "Curiosity",
  "Confidence",
  "Character",
  "Creativity",
  "Community",
  "Knowledge",
];

const stages = [
  {
    number: "1",
    title: "Early Years",
    text: "A gentle beginning where curiosity, confidence, and creativity begin to grow.",
    bg: "bg-white text-[#183B56]",
    sub: "text-[#526174]",
    num: "text-[#2E6DA4]/25",
  },
  {
    number: "2",
    title: "Primary School",
    text: "Building strong foundations through exploration, collaboration, and independent thinking.",
    bg: "bg-[#D3E6F5] text-[#183B56]",
    sub: "text-[#3F5266]",
    num: "text-[#2E6DA4]/30",
  },
  {
    number: "3",
    title: "Senior School",
    text: "Encouraging critical thinking, informed choices, and confidence for the future.",
    bg: "bg-[#183B56] text-white",
    sub: "text-white/75",
    num: "text-white/15",
  },
];

const gallery = [
  { src: "/images/life15.jpg", alt: "Students at Aim High School", span: "col-span-2 md:col-span-2 md:row-span-2" },
  { src: "/images/life13.jpg", alt: "Students learning at Aim High School", span: "" },
  { src: "/images/life14.jpg", alt: "School life at Aim High School", span: "" },
  { src: "/images/life11.jpg", alt: "Activities at Aim High School", span: "" },
  { src: "/images/life16.png", alt: "Students together at Aim High School", span: "" },
  { src: "/images/life12.jpg", alt: "A moment at Aim High School", span: "col-span-2 md:col-span-1" },
];

const alumniCards = [
  {
    number: "01",
    field: "Science & Research",
    title: "Curiosity opens doors.",
    description: "A passion for asking questions and discovering more.",
  },
  {
    number: "02",
    field: "Technology",
    title: "Ideas shape tomorrow.",
    description: "Turning creative thinking into new possibilities.",
  },
  {
    number: "03",
    field: "Business & Leadership",
    title: "Confidence to lead.",
    description: "Learning to take initiative and make a difference.",
  },
  {
    number: "04",
    field: "Arts & Creativity",
    title: "The courage to create.",
    description: "Finding new perspectives and expressing original ideas.",
  },
];

/* =====================================================
   MOTION HELPERS
====================================================== */

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True once the element has scrolled into view. */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/** Scroll-triggered entrance. `up` slides, `clip` wipes open, `left` slides sideways. */
function Reveal({
  children,
  variant = "up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  variant?: "up" | "clip" | "left";
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.15);
  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/** Headline whose words rise out of a mask, one after another. */
function Heading({
  lines,
  as: Tag = "h2",
  italicLast = false,
  className = "",
}: {
  lines: string[];
  as?: "h1" | "h2";
  italicLast?: boolean;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLHeadingElement>(0.25);
  let n = 0;

  return (
    <Tag
      ref={ref}
      className={`${display} ${className} ${inView ? "is-in" : ""}`}
    >
      {lines.map((line, li) => (
        <span
          key={line}
          className={`block ${
            italicLast && li === lines.length - 1 ? "font-normal italic" : ""
          }`}
        >
          {line.split(" ").map((word) => {
            const i = n++;
            return (
              <Fragment key={`${word}-${i}`}>
                <span className="word-mask">
                  <span className="word" style={{ "--i": i } as CSSProperties}>
                    {word}
                  </span>
                </span>{" "}
              </Fragment>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/** Counts up when scrolled into view. */
function Counter({
  from,
  to,
  suffix = "",
  duration = 1600,
}: {
  from: number;
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.6);
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setValue(to);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, from, to, duration]);

  return (
    <span ref={ref}>
      <span aria-hidden="true" className="tabular-nums">
        {value}
        {suffix}
      </span>
      <span className="sr-only">
        {to}
        {suffix}
      </span>
    </span>
  );
}

/** Button wrapper that leans toward the pointer. */
function Magnetic({
  children,
  strength = 0.25,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const move = (e: ReactMouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className="inline-block transition-transform duration-300 ease-out"
    >
      {children}
    </span>
  );
}

/* =====================================================
   PAGE
====================================================== */

export default function Home() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [section, setSection] = useState("");
  const [sent, setSent] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const menuOpenRef = useRef(false);
  const sentTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      if (sentTimer.current) clearTimeout(sentTimer.current);
    };
  }, []);

  /* One rAF-throttled scroll handler drives: progress bar, header
     hide/show, hero parallax, floating button and image parallax. */
  useEffect(() => {
    const reduce = prefersReducedMotion();
    const parallaxEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-parallax]")
    );
    let ticking = false;
    let last = window.scrollY;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      }

      setScrolled(y > 24);
      setShowFab(y > 700);

      if (y < 200) setHidden(false);
      else if (y > last + 4 && !menuOpenRef.current) setHidden(true);
      else if (y < last - 4) setHidden(false);
      if (Math.abs(y - last) > 4) last = y;

      if (!reduce) {
        if (heroRef.current && y < window.innerHeight * 1.3) {
          heroRef.current.style.setProperty("--sy", String(y));
        }
        for (const el of parallaxEls) {
          const parent = el.parentElement;
          if (!parent) continue;
          const r = parent.getBoundingClientRect();
          if (r.bottom < -100 || r.top > window.innerHeight + 100) continue;
          const speed = parseFloat(el.dataset.parallax || "0.08");
          const limit = r.height * 0.07;
          const offset =
            (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
          el.style.setProperty(
            "--py",
            String(Math.max(-limit, Math.min(limit, offset)))
          );
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Highlight the nav link for the section in view */
  useEffect(() => {
    const ids = ["hero", ...navLinks.map((l) => l.id)];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setSection(e.target.id === "hero" ? "" : e.target.id);
        }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  /* Close the mobile menu with Escape */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  /* Hero mouse parallax */
  const onHeroMouseMove = (e: ReactMouseEvent<HTMLElement>) => {
    const el = heroRef.current;
    if (!el || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", String(((e.clientX - r.left) / r.width - 0.5) * 2));
    el.style.setProperty("--my", String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };

  /* Enquiry form -> WhatsApp */
  const handleEnquiry = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const stage = String(data.get("stage") || "");
    const message = String(data.get("message") || "").trim();

    const text = [
      `Hello ${FULL_NAME} (Aim High), my name is ${name}.`,
      stage ? `I would like to ask about ${stage}.` : "",
      message,
      `You can reach me on ${phone}.`,
    ]
      .filter(Boolean)
      .join(" ");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setSent(true);
    if (sentTimer.current) clearTimeout(sentTimer.current);
    sentTimer.current = setTimeout(() => setSent(false), 5000);
  };

  const current = slides[active];

  const fieldBase = `peer w-full rounded-xl border border-[#183B56]/20 bg-[#F8FBFF] px-4 pb-2 pt-6 text-base transition-colors ${focus}`;
  const floatLabel =
    "pointer-events-none absolute left-4 top-2 text-xs text-[#526174] transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#2E6DA4]";

  return (
    <main
      id="top"
      className={`${dmSans.variable} ${cormorant.variable} min-h-screen overflow-x-clip bg-[#F8FBFF] font-[family-name:var(--font-dm-sans)] text-[#102A43] antialiased`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolSchema) }}
      />

      <style>{`
        html { scroll-behavior: smooth; }

        /* Entrances */
        .reveal { transition-property: opacity, transform, clip-path;
                  transition-duration: .9s; transition-timing-function: cubic-bezier(.22,1,.36,1); }
        .reveal-up   { opacity: 0; transform: translateY(32px); }
        .reveal-left { opacity: 0; transform: translateX(-36px); }
        .reveal-clip { clip-path: inset(0 0 100% 0); transition-duration: 1.3s;
                       transition-timing-function: cubic-bezier(.77,0,.175,1); }
        .reveal.is-in { opacity: 1; transform: none; clip-path: inset(0 0 0 0); }

        /* Word-by-word headline */
        .word-mask { display: inline-block; overflow: hidden; vertical-align: bottom;
                     padding: .1em .08em .16em 0; margin: -.1em -.08em -.16em 0; }
        .word { display: inline-block; transform: translateY(115%);
                transition: transform 1.05s cubic-bezier(.22,1,.36,1);
                transition-delay: calc(var(--i) * 70ms); }
        .is-in .word { transform: none; }

        /* Hero */
        @keyframes ah-reveal { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        .ah-reveal { animation: ah-reveal .9s cubic-bezier(.22,1,.36,1) both; }
        @keyframes ah-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .ah-fill { transform: scaleX(0); animation: ah-fill ${SLIDE_SECONDS}s linear forwards; }
        @keyframes ah-cue { 0% { transform: translateY(-100%); } 100% { transform: translateY(260%); } }
        .scroll-cue { animation: ah-cue 1.8s ease-in-out infinite; }
        @keyframes ah-menu { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
        .ah-menu { animation: ah-menu .25s ease-out both; }

        /* Marquee */
        @keyframes ah-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee { animation: ah-marquee 38s linear infinite; }
        .marquee:hover { animation-play-state: paused; }

        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          .reveal-up, .reveal-left, .reveal-clip { opacity: 1; transform: none; clip-path: none; transition: none; }
          .word { transform: none; transition: none; }
          .ah-reveal, .scroll-cue, .marquee, .ah-menu { animation: none; }
          .ah-fill { animation: none; transform: none; }
        }
      `}</style>

      {/* Scroll progress */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
        <div
          ref={barRef}
          className="h-full origin-left bg-[#6FA8DC]"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled || menuOpen
            ? "bg-white/90 shadow-[0_1px_0_rgba(24,59,86,0.08)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <nav
          aria-label="Main"
          className={`${container} flex items-center justify-between transition-[height] duration-300 ${
            scrolled ? "h-[72px]" : "h-20"
          }`}
        >
          <a
            href="#top"
            aria-label={`${FULL_NAME} — back to top`}
            className={`flex items-center gap-3 ${focus}`}
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#183B56]/10 bg-white shadow-[0_4px_14px_rgba(24,59,86,0.12)]">
              <Image
                src="/images/logoaims.png"
                alt=""
                width={56}
                height={56}
                priority
                className="h-full w-full scale-[1.12] object-contain"
              />
            </span>
            <span className="leading-none text-[#183B56]">
              <span className={`${display} block text-2xl font-semibold`}>
                Aim High
              </span>
              <span className="mt-1 block max-w-[10.5rem] text-[10px] font-medium leading-[1.25] tracking-wide text-[#183B56]/75 sm:max-w-none sm:text-[11px]">
                {FULL_NAME}
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-9 md:flex">
            {navLinks.slice(0, 4).map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`relative py-1 text-sm font-medium transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-[#183B56] after:transition-transform after:duration-300 hover:text-[#183B56] hover:after:scale-x-100 ${
                    section === link.id
                      ? "text-[#183B56] after:scale-x-100"
                      : "text-[#183B56]/75 after:scale-x-0"
                  } ${focus}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block">
              <Magnetic strength={0.2}>
                <a
                  href="#contact"
                  className={`inline-block rounded-full bg-[#183B56] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#2A5A7F] ${focus}`}
                >
                  Contact us
                </a>
              </Magnetic>
            </span>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#183B56]/20 text-[#183B56] md:hidden ${focus}`}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                ) : (
                  <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div id="mobile-menu" className="ah-menu border-t border-[#183B56]/10 bg-white md:hidden">
            <ul className={`${container} flex flex-col py-3`}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block border-b border-[#183B56]/10 py-4 text-base font-medium text-[#183B56] last:border-0 ${focus}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}
      <section
        id="hero"
        ref={heroRef}
        aria-label={`Welcome to ${FULL_NAME}`}
        className="relative min-h-[100svh] overflow-hidden bg-[#E7F2FA]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onMouseMove={onHeroMouseMove}
        onFocus={(e) => {
          if (e.target.matches(":focus-visible")) setPaused(true);
        }}
        onBlur={() => setPaused(false)}
      >
        {/* Image layer: pointer + scroll parallax; slides wipe in from the right */}
        <div
          className="absolute -inset-x-[4%] -inset-y-[8%]"
          aria-hidden="true"
          style={{
            transform:
              "translate3d(calc(var(--mx, 0) * -14px), calc(var(--my, 0) * -8px + min(var(--sy, 0) * 0.22px, 5vh)), 0)",
            transition: "transform .15s ease-out",
          }}
        >
          {slides.map((slide, i) => {
            const on = i === active;
            return (
              <div
                key={slide.image}
                className={`absolute inset-0 motion-reduce:!transition-none ${
                  on
                    ? "z-20 [clip-path:inset(0)] transition-[clip-path] duration-[1400ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
                    : "z-10 [clip-path:inset(0_0_0_100%)] transition-[clip-path] delay-[1400ms] duration-0"
                }`}
              >
                <div
                  className={`absolute inset-0 motion-reduce:!transition-none ${
                    on
                      ? "scale-100 transition-transform duration-[9000ms] ease-out"
                      : "scale-[1.1] transition-transform delay-[1400ms] duration-0"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    priority={i === 0}
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Readability overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/85 via-white/60 to-white/15 lg:via-white/40 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#183B56]/15 via-transparent to-transparent" />

        {/* Content */}
        <div
          className={`${container} relative z-10 flex min-h-[100svh] items-center pb-32 pt-28`}
          style={{
            transform: "translate3d(0, calc(var(--sy, 0) * 0.12px), 0)",
            opacity: "calc(1 - var(--sy, 0) / 750)",
          }}
        >
          <div key={active} className="max-w-3xl">
            <p className="ah-reveal mb-6 flex items-center gap-3 text-sm font-medium text-[#2E6DA4]">
              <span className="h-px w-10 bg-[#2E6DA4]/60" aria-hidden="true" />
              {current.label}
            </p>

            <Heading
              as="h1"
              lines={[current.line1, current.line2]}
              italicLast
              className="text-[clamp(2.9rem,8vw,7.25rem)] font-medium leading-[0.95] tracking-[-0.02em] text-[#183B56]"
            />

            <p
              className="ah-reveal mt-8 max-w-lg text-base leading-7 text-[#3F5266] sm:text-lg sm:leading-8"
              style={{ animationDelay: "380ms" }}
            >
              {current.description}
            </p>

            <div
              className="ah-reveal mt-10 flex flex-wrap items-center gap-4"
              style={{ animationDelay: "500ms" }}
            >
              <Magnetic>
                <a
                  href="#contact"
                  className={`inline-block rounded-full bg-[#183B56] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#2A5A7F] ${focus}`}
                >
                  Plan a visit
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="#story"
                  className={`inline-block rounded-full border border-[#183B56]/30 bg-white/60 px-7 py-3.5 text-sm font-semibold text-[#183B56] backdrop-blur-sm transition-colors hover:border-[#183B56] hover:bg-white ${focus}`}
                >
                  Read our story
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Slide timeline: each bar fills while its slide plays, then advances */}
        <div className={`${container} absolute inset-x-0 bottom-6 z-30 flex items-end justify-between`}>
          <div role="group" aria-label="Choose slide" className="flex gap-3 sm:gap-6">
            {slides.map((slide, i) => (
              <button
                key={slide.label}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show slide ${i + 1}: ${slide.label}`}
                aria-current={active === i}
                className={`w-20 py-2 text-left sm:w-36 ${focus}`}
              >
                <span
                  className={`mb-2 hidden text-xs font-medium transition-colors sm:block ${
                    active === i ? "text-[#183B56]" : "text-[#183B56]/60"
                  }`}
                >
                  {slide.label}
                </span>
                <span className="relative block h-[3px] overflow-hidden rounded-full bg-[#183B56]/20">
                  {active === i && (
                    <span
                      key={`fill-${active}`}
                      className="ah-fill absolute inset-0 origin-left bg-[#183B56]"
                      style={{ animationPlayState: paused ? "paused" : "running" }}
                      onAnimationEnd={() =>
                        setActive((a) => (a + 1) % slides.length)
                      }
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          <a
            href="#story"
            className={`hidden items-center gap-3 pb-2 text-sm text-[#183B56]/75 transition-colors hover:text-[#183B56] sm:flex ${focus}`}
          >
            Scroll
            <span className="relative block h-10 w-px overflow-hidden bg-[#183B56]/20" aria-hidden="true">
              <span className="scroll-cue absolute inset-x-0 top-0 h-4 bg-[#183B56]" />
            </span>
          </a>
        </div>
      </section>

      {/* =====================================================
          VALUES MARQUEE
      ====================================================== */}
      <div className="overflow-hidden bg-[#183B56] py-5" aria-hidden="true">
        <div className="marquee flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center">
              {values.map((value) => (
                <li key={value} className="flex items-center">
                  <span className={`${display} px-8 text-3xl italic text-white/90 md:text-4xl`}>
                    {value}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#6FA8DC]" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* =====================================================
          FACTS
      ====================================================== */}
      <section aria-label={`${FULL_NAME} at a glance`} className="border-b border-[#183B56]/10 bg-white">
        <dl className={`${container} grid divide-y divide-[#183B56]/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0`}>
          <div className="py-8 sm:px-8 sm:first:pl-0">
            <dt className={`${display} text-5xl font-medium leading-none text-[#183B56]`}>
              <Counter from={1990} to={2007} />
            </dt>
            <dd className="mt-3 text-sm text-[#526174]">The year the school was founded</dd>
          </div>
          <div className="py-8 sm:px-8">
            <dt className={`${display} text-5xl font-medium leading-none text-[#183B56]`}>
              <Counter from={0} to={3} suffix=" stages" duration={1000} />
            </dt>
            <dd className="mt-3 text-sm text-[#526174]">Early Years, Primary and Senior School</dd>
          </div>
          <div className="py-8 sm:px-8 sm:last:pr-0">
            <dt className={`${display} text-5xl font-medium leading-none text-[#183B56]`}>
              Gujrat
            </dt>
            <dd className="mt-3 text-sm text-[#526174]">Jalalpur Jattan Road, Punjab</dd>
          </div>
        </dl>
      </section>

      {/* =====================================================
          OUR STORY
      ====================================================== */}
      <section id="story" className="relative scroll-mt-20 overflow-hidden bg-[#F8FBFF] py-20 lg:py-28">
        <div className={`${container} grid items-center gap-14 lg:grid-cols-[1fr_440px] lg:gap-24`}>
          <div>
            <Heading
              lines={["Where it all", "began."]}
              italicLast
              className="max-w-2xl text-[clamp(2.75rem,5.5vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.02em] text-[#183B56]"
            />

            <div className="mt-8 max-w-xl space-y-5 text-base leading-8 text-[#526174] md:text-[17px]">
              <Reveal delay={150}>
                <p>
                  <strong className="font-semibold text-[#183B56]">{FULL_NAME}</strong>{" "}
                  — known to families as Aim High School — is a place where
                  learning extends beyond the classroom. Since its beginning, the
                  school has focused on creating an environment where students are
                  encouraged to ask questions, explore their abilities, build
                  confidence, and discover the person they want to become.
                </p>
              </Reveal>
              <Reveal delay={280}>
                <p>
                  Founded by{" "}
                  <strong className="font-semibold text-[#183B56]">Mr. Muhammad Sajid</strong>
                  , who is also{" "}
                  <strong className="font-semibold text-[#183B56]">
                    President of the Private Schools &amp; Colleges Association
                  </strong>
                  , Aim High continues to bring together knowledge, character,
                  creativity, and community.
                </p>
              </Reveal>
            </div>

            <Reveal delay={400} className="mt-9">
              <Magnetic>
                <a
                  href="#academics"
                  className={`inline-block rounded-full border border-[#183B56]/25 px-6 py-3 text-sm font-semibold text-[#183B56] transition-colors hover:border-[#183B56] hover:bg-[#183B56] hover:text-white ${focus}`}
                >
                  See how students learn
                </a>
              </Magnetic>
            </Reveal>
          </div>

          <Reveal variant="clip" className="mx-auto w-full max-w-[440px]">
            <figure className="relative">
              <div className="absolute inset-x-3 bottom-16 top-5 rounded-[3rem] bg-[#E7F2FA]" />
              <div className="relative z-10 h-[460px] w-full">
                <Image
                  src="/images/founder.png"
                  alt={`Mr. Muhammad Sajid, founder of ${FULL_NAME}`}
                  fill
                  sizes="(max-width: 1024px) 90vw, 440px"
                  className="object-contain object-bottom"
                />
              </div>
              <figcaption className="relative z-20 ml-5 mt-3 border-l-2 border-[#6FA8DC] pl-5">
                <span className={`${display} block text-3xl font-medium text-[#183B56]`}>
                  Mr. Muhammad Sajid
                </span>
                <span className="mt-1 block text-sm text-[#526174]">
                  Founder, {FULL_NAME}
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          ACADEMICS — stacking cards
      ====================================================== */}
      <section id="academics" className="scroll-mt-20 bg-[#E7F2FA] py-20 lg:py-28">
        <div className={`${container} grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20`}>
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Heading
              lines={["Learning that", "opens doors."]}
              italicLast
              className="text-[clamp(2.75rem,5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-[#183B56]"
            />
            <Reveal delay={200}>
              <p className="mt-6 max-w-md text-base leading-8 text-[#526174]">
                At Aim High School, learning goes beyond remembering information.
                Students are encouraged to question, explore, create, and use what
                they learn with confidence.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <p className={`${display} mt-10 hidden max-w-sm text-2xl italic text-[#3F5266] lg:block`}>
                Every stage is a new opportunity to discover what is possible.
              </p>
            </Reveal>
          </div>

          <ol>
            {stages.map((stage, i) => (
              <li
                key={stage.title}
                className={`sticky mb-6 flex min-h-[260px] items-start justify-between overflow-hidden rounded-[2rem] p-8 shadow-[0_18px_40px_-18px_rgba(24,59,86,0.35)] sm:p-10 ${stage.bg}`}
                style={{ top: 112 + i * 20 }}
              >
                <div className="relative z-10 max-w-sm self-end">
                  <h3 className={`${display} text-4xl font-medium leading-none`}>
                    {stage.title}
                  </h3>
                  <p className={`mt-4 text-base leading-7 ${stage.sub}`}>{stage.text}</p>
                </div>
                <span
                  aria-hidden="true"
                  className={`${display} pointer-events-none absolute -right-2 -top-6 select-none text-[8rem] font-medium leading-none sm:text-[11rem] ${stage.num}`}
                >
                  {stage.number}
                </span>
                <span className="sr-only">Stage {stage.number}</span>
              </li>
            ))}
            <li className="pt-2 lg:hidden">
              <p className={`${display} text-xl italic text-[#3F5266]`}>
                Every stage is a new opportunity to discover what is possible.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* =====================================================
          STUDENT LIFE — parallax mosaic
      ====================================================== */}
      <section id="life" className="scroll-mt-20 bg-[#F8FBFF] py-20 lg:py-28">
        <div className={container}>
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <Heading
              lines={["Life at", "Aim High School"]}
              italicLast
              className="text-[clamp(2.75rem,5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-[#183B56]"
            />
            <Reveal delay={200}>
              <p className={`${display} text-xl italic text-[#526174] md:text-right md:text-2xl`}>
                Where every moment becomes a memory.
              </p>
            </Reveal>
          </div>

          <div className="grid auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[210px] md:grid-cols-3 md:auto-rows-[240px] md:gap-4">
            {gallery.map((photo, i) => (
              <Reveal
                key={photo.src}
                variant="clip"
                delay={(i % 3) * 120}
                className={`group relative overflow-hidden rounded-3xl bg-[#E7F2FA] ${photo.span}`}
              >
                <div
                  data-parallax="0.09"
                  className="absolute -inset-[8%]"
                  style={{ transform: "translate3d(0, calc(var(--py, 0) * 1px), 0)" }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          ALUMNI — static editorial grid
      ====================================================== */}
      <section id="alumni" className="scroll-mt-20 bg-[#E7F2FA] py-20 lg:py-28">
        <div className={container}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#2E6DA4]">
                A legacy of possibility
              </p>

              <Heading
                lines={["Where our graduates", "are today."]}
                italicLast
                className="text-[clamp(2.75rem,5vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-[#183B56]"
              />

              <p className="mt-5 max-w-sm text-base leading-7 text-[#526174]">
                Different dreams, different journeys, one beginning.
              </p>
            </div>

            <div className="hidden h-px w-24 bg-[#2E6DA4]/50 md:block" aria-hidden="true" />
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {alumniCards.map((item, i) => (
              <Reveal key={item.number} delay={i * 100} className="h-full">
                <article className="group relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-2xl border border-[#183B56]/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#2E6DA4]/50 hover:shadow-lg hover:shadow-[#183B56]/[0.06] sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#2E6DA4]">
                      Alumni
                    </span>
                    <span className="text-sm tabular-nums text-[#183B56]/50">
                      {item.number}
                    </span>
                  </div>

                  <div className="my-8 h-px w-full bg-[#183B56]/10" aria-hidden="true">
                    <div className="h-px w-10 bg-[#2E6DA4] transition-all duration-500 group-hover:w-full" />
                  </div>

                  <div className="mt-auto">
                    <p className="text-xs font-semibold uppercase tracking-[0.13em] text-[#2E6DA4]">
                      {item.field}
                    </p>
                    <h3 className={`${display} mt-3 text-3xl font-medium leading-tight text-[#183B56]`}>
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#526174]">
                      {item.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4" aria-hidden="true">
            <div className="h-px flex-1 bg-[#183B56]/15" />
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#526174]">
              Inspired to achieve
            </span>
            <div className="h-px flex-1 bg-[#183B56]/15" />
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT
      ====================================================== */}
      <section id="contact" className="scroll-mt-20 bg-[#183B56] py-20 text-white lg:py-28">
        <div className={`${container} grid gap-14 lg:grid-cols-2 lg:gap-24`}>
          <div>
            <Heading
              lines={["We would love", "to meet you."]}
              italicLast
              className="text-[clamp(2.75rem,5.5vw,4.75rem)] font-medium leading-[1.02] tracking-[-0.02em]"
            />
            <Reveal delay={200}>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/75">
                Visit {FULL_NAME} and see a welcoming environment where
                students are encouraged to learn, grow, explore, and build
                confidence for the future.
              </p>
            </Reveal>

            <dl className="mt-12 space-y-7">
              {[
                {
                  label: "Visit",
                  node: (
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Aim+High+School+near+Bypass+Jalalpur+Jattan+Road+Gujrat"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Jalalpur Jattan Road, Gujrat, Punjab, Pakistan
                    </a>
                  ),
                },
                {
                  label: "Call",
                  node: <a href="tel:+923006262348">{PHONE_DISPLAY}</a>,
                },
                {
                  label: "Email",
                  node: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>,
                },
              ].map((row, i) => (
                <Reveal
                  key={row.label}
                  variant="left"
                  delay={250 + i * 110}
                  className="[&_a]:text-lg [&_a]:font-medium [&_a]:underline [&_a]:decoration-white/25 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:hover:decoration-white [&_a]:focus-visible:outline [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-2 [&_a]:focus-visible:outline-white"
                >
                  <dt className="text-sm text-white/70">{row.label}</dt>
                  <dd className="mt-1 break-words">{row.node}</dd>
                </Reveal>
              ))}
            </dl>
          </div>

          <Reveal delay={150}>
            <form
              onSubmit={handleEnquiry}
              className="rounded-3xl bg-white p-6 text-[#102A43] shadow-[0_24px_60px_rgba(0,0,0,0.25)] sm:p-9"
            >
              <h3 className={`${display} text-3xl font-medium text-[#183B56]`}>
                Send us a message
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#526174]">
                Tell us a little about your child and we will get back to you.
              </p>

              <div className="mt-7 space-y-4">
                <div className="relative">
                  <input id="name" name="name" type="text" required autoComplete="name" placeholder=" " className={fieldBase} />
                  <label htmlFor="name" className={floatLabel}>Your name</label>
                </div>

                <div className="relative">
                  <input id="phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder=" " className={fieldBase} />
                  <label htmlFor="phone" className={floatLabel}>Phone number</label>
                </div>

                <div className="relative">
                  <select
                    id="stage"
                    name="stage"
                    defaultValue=""
                    className={`h-[58px] w-full appearance-none rounded-xl border border-[#183B56]/20 bg-[#F8FBFF] pb-1.5 pl-4 pr-11 pt-6 text-base leading-6 transition-colors ${focus}`}
                  >
                    <option value="">Not sure yet</option>
                    <option value="Early Years">Early Years</option>
                    <option value="Primary School">Primary School</option>
                    <option value="Senior School">Senior School</option>
                  </select>
                  <label
                    htmlFor="stage"
                    className="pointer-events-none absolute left-4 top-[7px] text-xs leading-4 text-[#526174]"
                  >
                    Which stage are you asking about?
                  </label>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-[#183B56]"
                  >
                    <path d="M3.5 6l4.5 4.5L12.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div className="relative">
                  <textarea id="message" name="message" rows={3} placeholder=" " className={`${fieldBase} resize-none`} />
                  <label htmlFor="message" className={floatLabel}>Message (optional)</label>
                </div>
              </div>

              <button
                type="submit"
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-colors ${
                  sent ? "bg-[#2E7D5B]" : "bg-[#183B56] hover:bg-[#2A5A7F]"
                } ${focus}`}
              >
                {sent ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8.5l3.2 3L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Opening WhatsApp
                  </>
                ) : (
                  "Send on WhatsApp"
                )}
              </button>
              <p className="mt-3 text-center text-xs text-[#526174]" aria-live="polite">
                {sent
                  ? "If nothing opened, call us on " + PHONE_DISPLAY + "."
                  : "This opens WhatsApp with your message ready to send."}
              </p>
            </form>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="overflow-hidden bg-[#102A43] text-white/70">
        <div
          aria-hidden="true"
          className={`${display} select-none whitespace-nowrap pt-10 text-center text-[clamp(4rem,17vw,15rem)] font-medium leading-[0.85] tracking-[-0.03em] text-white/[0.06]`}
        >
          Aim High
        </div>
        <div className={`${container} flex flex-col gap-6 border-t border-white/10 py-8 md:flex-row md:items-center md:justify-between`}>
          <p className="text-sm">
            © {new Date().getFullYear()} {FULL_NAME} (Aim High School), Gujrat. All rights reserved.
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-7 gap-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={`transition-colors hover:text-white ${focus}`}>
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#top" className={`transition-colors hover:text-white ${focus}`}>
                  Back to top
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>

      {/* Floating message button */}
      <div
        className={`fixed bottom-5 right-5 z-40 transition-all duration-500 ${
          showFab
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-20 opacity-0"
        }`}
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-ping rounded-full bg-[#183B56]/30 motion-reduce:hidden"
        />
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Message ${FULL_NAME} on WhatsApp`}
          tabIndex={showFab ? 0 : -1}
          className={`group relative flex h-14 items-center overflow-hidden rounded-full bg-[#183B56] px-[17px] text-white shadow-[0_10px_30px_rgba(24,59,86,0.4)] transition-all duration-500 hover:pr-5 ${focus}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
            <path
              d="M4 5.5A1.5 1.5 0 015.5 4h13A1.5 1.5 0 0120 5.5v9a1.5 1.5 0 01-1.5 1.5H10l-4.2 3.6a.5.5 0 01-.8-.4V16A1.5 1.5 0 014 14.5v-9z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
          <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-500 group-hover:ml-3 group-hover:max-w-[140px] group-hover:opacity-100 group-focus-visible:ml-3 group-focus-visible:max-w-[140px] group-focus-visible:opacity-100">
            Message us
          </span>
        </a>
      </div>
    </main>
  );
}
