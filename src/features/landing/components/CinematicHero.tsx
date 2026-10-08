import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLocale } from "@/shared/i18n/LocaleContext";
import { cn } from "@/shared/lib/utils";
import { HeartRateLoader } from "./HeartRateLoader";
import { StrokeText } from "./StrokeText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface CinematicHeroProps {
  brandName?: string;
  tagline1?: string;
  tagline2?: string;
  cardHeading?: string;
  cardDescription?: ReactNode;
  metricValue?: number;
  metricLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  onPrimaryCta?: () => void;
  onSecondaryCta?: () => void;
  className?: string;
}

const INJECTED_STYLES = `
  .gsap-reveal { visibility: hidden; }

  /* Environment Overlays */
  .film-grain {
      position: absolute; inset: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 50; opacity: 0.05; mix-blend-mode: overlay;
      background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
  }

  .bg-grid-theme {
      background-size: 60px 60px;
      background-image:
          linear-gradient(to right, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px),
          linear-gradient(to bottom, color-mix(in srgb, var(--color-foreground) 5%, transparent) 1px, transparent 1px);
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
      -webkit-mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
  }

  /* -------------------------------------------------------------------
     PHYSICAL SKEUOMORPHIC MATERIALS (Restored 3D Depth)
  ---------------------------------------------------------------------- */

  /* OUTSIDE THE CARD: Theme-aware text (Shadow in Light Mode, Glow in Dark Mode) */
  .text-3d-matte {
      color: var(--color-foreground);
      text-shadow:
          0 10px 30px color-mix(in srgb, var(--color-foreground) 20%, transparent),
          0 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent);
  }

  .text-silver-matte {
      background: linear-gradient(180deg, var(--color-foreground) 0%, color-mix(in srgb, var(--color-foreground) 40%, transparent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0); /* Hardware acceleration to prevent WebKit clipping bug */
      filter:
          drop-shadow(0px 10px 20px color-mix(in srgb, var(--color-foreground) 15%, transparent))
          drop-shadow(0px 2px 4px color-mix(in srgb, var(--color-foreground) 10%, transparent));
  }

  /* INSIDE THE CARD: Hardcoded Silver/White for the dark background, deep rich shadows */
  .text-card-silver-matte {
      background: linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      transform: translateZ(0);
      filter:
          drop-shadow(0px 12px 24px rgba(0,0,0,0.8))
          drop-shadow(0px 4px 8px rgba(0,0,0,0.6));
  }

  /* Deep Physical Card with Dynamic Mouse Lighting */
  .premium-depth-card {
      background: linear-gradient(145deg, #162C6D 0%, #0A101D 100%);
      box-shadow:
          0 40px 100px -20px rgba(0, 0, 0, 0.9),
          0 20px 40px -20px rgba(0, 0, 0, 0.8),
          inset 0 1px 2px rgba(255, 255, 255, 0.2),
          inset 0 -2px 4px rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.04);
      position: relative;
  }

  .premium-depth-card-green {
      background: linear-gradient(145deg, #0E4A38 0%, #071410 100%);
      box-shadow:
          0 40px 100px -20px rgba(0, 0, 0, 0.9),
          0 20px 40px -20px rgba(0, 0, 0, 0.8),
          inset 0 1px 2px rgba(46, 230, 166, 0.18),
          inset 0 -2px 4px rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(46, 230, 166, 0.06);
      position: relative;
  }

  .premium-depth-card-ember {
      background: linear-gradient(145deg, #6B2418 0%, #120806 100%);
      box-shadow:
          0 40px 100px -20px rgba(0, 0, 0, 0.9),
          0 20px 40px -20px rgba(0, 0, 0, 0.8),
          inset 0 1px 2px rgba(255, 90, 60, 0.2),
          inset 0 -2px 4px rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 90, 60, 0.08);
      position: relative;
  }

  .card-sheen {
      position: absolute; inset: 0; border-radius: inherit; pointer-events: none; z-index: 50;
      background: radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06) 0%, transparent 40%);
      mix-blend-mode: screen; transition: opacity 0.3s ease;
  }

  .nutrition-cal-day, .workout-cal-day {
      background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      border: 1px solid rgba(255,255,255,0.04);
  }
  .nutrition-cal-day.is-active {
      background: linear-gradient(180deg, rgba(46,230,166,0.22) 0%, rgba(46,230,166,0.06) 100%);
      border-color: rgba(46,230,166,0.35);
      box-shadow: 0 0 12px rgba(46,230,166,0.15);
  }
  .nutrition-cal-day.has-meals::after {
      content: "";
      display: block;
      width: 4px; height: 4px;
      margin: 2px auto 0;
      border-radius: 999px;
      background: #2ee6a6;
      box-shadow: 0 0 6px rgba(46,230,166,0.8);
  }
  .workout-cal-day.is-active {
      background: linear-gradient(180deg, rgba(255,90,60,0.25) 0%, rgba(255,90,60,0.06) 100%);
      border-color: rgba(255,90,60,0.4);
      box-shadow: 0 0 12px rgba(255,90,60,0.18);
  }
  .workout-cal-day.has-sessions::after {
      content: "";
      display: block;
      width: 4px; height: 4px;
      margin: 2px auto 0;
      border-radius: 999px;
      background: #ff5a3c;
      box-shadow: 0 0 6px rgba(255,90,60,0.85);
  }

  /* Realistic iPhone Mockup Hardware */
  .iphone-bezel {
      background-color: #111;
      box-shadow:
          inset 0 0 0 2px #52525B,
          inset 0 0 0 7px #000,
          0 40px 80px -15px rgba(0,0,0,0.9),
          0 15px 25px -5px rgba(0,0,0,0.7);
      transform-style: preserve-3d;
  }

  .hardware-btn {
      background: linear-gradient(90deg, #404040 0%, #171717 100%);
      box-shadow:
          -2px 0 5px rgba(0,0,0,0.8),
          inset -1px 0 1px rgba(255,255,255,0.15),
          inset 1px 0 2px rgba(0,0,0,0.8);
      border-left: 1px solid rgba(255,255,255,0.05);
  }

  .screen-glare {
      background: linear-gradient(110deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 45%);
  }

  .widget-depth {
      background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
      box-shadow:
          0 10px 20px rgba(0,0,0,0.3),
          inset 0 1px 1px rgba(255,255,255,0.05),
          inset 0 -1px 1px rgba(0,0,0,0.5);
      border: 1px solid rgba(255,255,255,0.03);
  }

  .floating-ui-badge {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow:
          0 0 0 1px rgba(255, 255, 255, 0.1),
          0 25px 50px -12px rgba(0, 0, 0, 0.8),
          inset 0 1px 1px rgba(255,255,255,0.2),
          inset 0 -1px 1px rgba(0,0,0,0.5);
  }

  /* Physical Tactile Buttons */
  .btn-modern-light, .btn-modern-dark {
      transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }
  .btn-modern-light {
      background: linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%);
      color: #0F172A;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.1), 0 12px 24px -4px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 6px 12px -2px rgba(0,0,0,0.15), 0 20px 32px -6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.06);
  }
  .btn-modern-light:active {
      transform: translateY(1px);
      background: linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.1), inset 0 3px 6px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.02);
  }
  .btn-modern-dark {
      background: linear-gradient(180deg, #27272A 0%, #18181B 100%);
      color: #FFFFFF;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.6), 0 12px 24px -4px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:hover {
      transform: translateY(-3px);
      background: linear-gradient(180deg, #3F3F46 0%, #27272A 100%);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.15), 0 6px 12px -2px rgba(0,0,0,0.7), 0 20px 32px -6px rgba(0,0,0,1), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.8);
  }
  .btn-modern-dark:active {
      transform: translateY(1px);
      background: #18181B;
      box-shadow: 0 0 0 1px rgba(255,255,255,0.05), inset 0 3px 8px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(0,0,0,0.5);
  }

  .btn-pill-dark {
      background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.06);
      box-shadow:
          0 8px 20px rgba(0, 0, 0, 0.55),
          0 2px 4px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.14),
          inset 0 -1px 0 rgba(0, 0, 0, 0.45);
      transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease;
  }
  .btn-pill-dark:hover {
      transform: translateY(-2px);
      background: linear-gradient(180deg, #323232 0%, #222222 100%);
      box-shadow:
          0 12px 28px rgba(0, 0, 0, 0.6),
          0 4px 8px rgba(0, 0, 0, 0.45),
          inset 0 1px 0 rgba(255, 255, 255, 0.18),
          inset 0 -1px 0 rgba(0, 0, 0, 0.45);
  }
  .btn-pill-dark:active {
      transform: translateY(1px);
      background: linear-gradient(180deg, #1f1f1f 0%, #141414 100%);
      box-shadow:
          0 2px 6px rgba(0, 0, 0, 0.5),
          inset 0 2px 4px rgba(0, 0, 0, 0.6),
          inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }

  .hero-copy-enter {
      animation: heroCopyEnter 0.9s ease-out 2.2s both;
  }

  @keyframes heroCopyEnter {
      from { opacity: 0; transform: translateY(14px); filter: blur(8px); }
      to { opacity: 1; transform: translateY(0); filter: blur(0); }
  }

  .progress-ring {
      transform: rotate(-90deg);
      transform-origin: center;
      stroke-dasharray: 402;
      stroke-dashoffset: 402;
      stroke-linecap: round;
  }
`;

export function CinematicHero({
  brandName = "FITNES",
  tagline1,
  tagline2,
  cardHeading,
  cardDescription,
  metricValue = 30,
  metricLabel,
  ctaHeading,
  ctaDescription,
  onPrimaryCta,
  onSecondaryCta,
  className,
}: CinematicHeroProps) {
  const { t } = useLocale();
  const resolvedTagline1 = tagline1 ?? t("hero.tagline1");
  const resolvedTagline2 = tagline2 ?? t("hero.tagline2");
  const resolvedCardHeading = cardHeading ?? t("hero.cardHeading");
  const resolvedCardDescription = cardDescription ?? (
    <>
      <span className="font-semibold text-white">{brandName}</span>
      {t("hero.cardDescription")}
    </>
  );
  const resolvedMetricLabel = metricLabel ?? t("hero.metricLabel");
  const resolvedCtaHeading = ctaHeading ?? t("hero.ctaHeading");
  const resolvedCtaDescription = ctaDescription ?? t("hero.ctaDescription");

  const containerRef = useRef<HTMLDivElement>(null);
  const mainCardRef = useRef<HTMLDivElement>(null);
  const nutritionCardRef = useRef<HTMLDivElement>(null);
  const workoutCardRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const nutritionMockupRef = useRef<HTMLDivElement>(null);
  const workoutMockupRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef(0);
  const [strokeFontSize, setStrokeFontSize] = useState(48);

  const weekdays = [
    t("app.calMon"),
    t("app.calTue"),
    t("app.calWed"),
    t("app.calThu"),
    t("app.calFri"),
    t("app.calSat"),
    t("app.calSun"),
  ];
  const nutritionDays = [
    { day: "3", marked: false, active: false },
    { day: "4", marked: true, active: false },
    { day: "5", marked: true, active: false },
    { day: "6", marked: false, active: false },
    { day: "7", marked: true, active: false },
    { day: "8", marked: true, active: true },
    { day: "9", marked: false, active: false },
  ];
  const workoutDays = [
    { day: "3", marked: true, active: false },
    { day: "4", marked: false, active: false },
    { day: "5", marked: true, active: false },
    { day: "6", marked: true, active: true },
    { day: "7", marked: false, active: false },
    { day: "8", marked: true, active: false },
    { day: "9", marked: false, active: false },
  ];

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1024) setStrokeFontSize(72);
      else if (width >= 768) setStrokeFontSize(52);
      else setStrokeFontSize(34);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const hero = containerRef.current?.getBoundingClientRect();
      if (!hero || hero.bottom < 0 || hero.top > window.innerHeight) return;

      cancelAnimationFrame(requestRef.current);

      requestRef.current = requestAnimationFrame(() => {
        const xVal = (e.clientX / window.innerWidth - 0.5) * 2;
        const yVal = (e.clientY / window.innerHeight - 0.5) * 2;

        const applySheen = (card: HTMLDivElement | null) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
          card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        };

        applySheen(mainCardRef.current);
        applySheen(nutritionCardRef.current);
        applySheen(workoutCardRef.current);

        const tilt = {
          rotationY: xVal * 12,
          rotationX: -yVal * 12,
          ease: "power3.out" as const,
          duration: 1.2,
        };
        if (mockupRef.current) gsap.to(mockupRef.current, tilt);
        if (nutritionMockupRef.current) gsap.to(nutritionMockupRef.current, tilt);
        if (workoutMockupRef.current) gsap.to(workoutMockupRef.current, tilt);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      const offscreenY = window.innerHeight + 200;
      const cardRadius = isMobile ? "32px" : "40px";
      /* Gap between stacked cards during handoff (scale 0.85 + 28px) */
      const stackOffset = window.innerHeight * 0.85 + 28;

      gsap.set(".main-card", {
        y: offscreenY,
        autoAlpha: 1,
        scale: 1,
        transformOrigin: "center center",
      });
      gsap.set(".nutrition-card", {
        y: offscreenY,
        autoAlpha: 1,
        scale: 1,
        transformOrigin: "center center",
      });
      gsap.set(".workout-card", {
        y: offscreenY,
        autoAlpha: 1,
        scale: 1,
        transformOrigin: "center center",
      });
      gsap.set(".nutrition-stage", { autoAlpha: 0 });
      gsap.set(".workout-stage", { autoAlpha: 0 });
      gsap.set(
        [
          ".card-left-text",
          ".card-right-text",
          ".mockup-scroll-wrapper",
          ".floating-badge",
          ".phone-widget",
          ".nutrition-left-text",
          ".nutrition-right-text",
          ".nutrition-mockup-wrapper",
          ".nutrition-badge",
          ".nutrition-widget",
          ".workout-left-text",
          ".workout-right-text",
          ".workout-mockup-wrapper",
          ".workout-badge",
          ".workout-widget",
        ],
        { autoAlpha: 0 },
      );
      gsap.set(".cta-wrapper", {
        autoAlpha: 0,
        scale: 0.8,
        filter: "blur(30px)",
      });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=15000",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      scrollTl
        .to(
          [".hero-text-wrapper", ".bg-grid-theme"],
          {
            scale: 1.15,
            filter: "blur(20px)",
            opacity: 0.2,
            ease: "power2.inOut",
            duration: 2,
          },
          0,
        )
        .to(".main-card", { y: 0, ease: "power3.inOut", duration: 2 }, 0)
        .to(".main-card", {
          width: "100%",
          height: "100%",
          borderRadius: "0px",
          ease: "power3.inOut",
          duration: 1.5,
        })
        .fromTo(
          ".mockup-scroll-wrapper",
          {
            y: 300,
            z: -500,
            rotationX: 50,
            rotationY: -30,
            autoAlpha: 0,
            scale: 0.6,
          },
          {
            y: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            autoAlpha: 1,
            scale: 1,
            ease: "expo.out",
            duration: 2.5,
          },
          "-=0.8",
        )
        .fromTo(
          ".phone-widget",
          { y: 40, autoAlpha: 0, scale: 0.95 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            stagger: 0.15,
            ease: "back.out(1.2)",
            duration: 1.5,
          },
          "-=1.5",
        )
        .to(
          ".progress-ring",
          { strokeDashoffset: 60, duration: 2, ease: "power3.inOut" },
          "-=1.2",
        )
        .to(
          ".counter-val",
          {
            innerHTML: metricValue,
            snap: { innerHTML: 1 },
            duration: 2,
            ease: "expo.out",
          },
          "-=2.0",
        )
        .fromTo(
          ".floating-badge",
          { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            rotationZ: 0,
            ease: "back.out(1.5)",
            duration: 1.5,
            stagger: 0.2,
          },
          "-=2.0",
        )
        .fromTo(
          ".card-left-text",
          { x: -50, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 },
          "-=1.5",
        )
        .fromTo(
          ".card-right-text",
          { x: 50, autoAlpha: 0, scale: 0.8 },
          { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 },
          "<",
        )
        .to({}, { duration: 2.5 })
        .to(
          [
            ".mockup-scroll-wrapper",
            ".floating-badge",
            ".card-left-text",
            ".card-right-text",
          ],
          {
            scale: 0.9,
            y: -40,
            z: -200,
            autoAlpha: 0,
            ease: "power3.in",
            duration: 1.2,
            stagger: 0.05,
          },
        )
        /* 1) Pullback — scale+radius (width% is unreliable on this flex child) */
        .to(
          ".main-card",
          {
            scale: 0.85,
            borderRadius: cardRadius,
            ease: "expo.inOut",
            duration: 1.8,
          },
          "bluePullback",
        )
        .to({}, { duration: 0.7 })
        /* 2) Stack with gap, scroll up in sync */
        .set(".nutrition-stage", { autoAlpha: 1 })
        .set(".nutrition-card", {
          width: "100%",
          height: "100%",
          borderRadius: cardRadius,
          scale: 0.85,
          y: stackOffset,
        })
        .to(
          ".main-card",
          {
            y: -offscreenY,
            ease: "none",
            duration: 2,
          },
          "blueExit",
        )
        .to(
          ".nutrition-card",
          {
            y: 0,
            ease: "none",
            duration: 2,
          },
          "blueExit",
        )
        .set(".main-card", { autoAlpha: 0 })
        .to(".nutrition-card", {
          scale: 1,
          borderRadius: "0px",
          ease: "power3.inOut",
          duration: 1.5,
        })
        /* ——— Nutrition card content ——— */
        .fromTo(
          ".nutrition-mockup-wrapper",
          {
            y: 300,
            z: -500,
            rotationX: 50,
            rotationY: 30,
            autoAlpha: 0,
            scale: 0.6,
          },
          {
            y: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            autoAlpha: 1,
            scale: 1,
            ease: "expo.out",
            duration: 2.5,
          },
          "-=0.8",
        )
        .fromTo(
          ".nutrition-widget",
          { y: 40, autoAlpha: 0, scale: 0.95 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            stagger: 0.12,
            ease: "back.out(1.2)",
            duration: 1.5,
          },
          "-=1.5",
        )
        .fromTo(
          ".nutrition-badge",
          { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: 10 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            rotationZ: 0,
            ease: "back.out(1.5)",
            duration: 1.5,
            stagger: 0.2,
          },
          "-=2.0",
        )
        .fromTo(
          ".nutrition-left-text",
          { x: -50, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 },
          "-=1.5",
        )
        .fromTo(
          ".nutrition-right-text",
          { x: 50, autoAlpha: 0, scale: 0.8 },
          { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 },
          "<",
        )
        .to({}, { duration: 2.5 })
        .to(
          [
            ".nutrition-mockup-wrapper",
            ".nutrition-badge",
            ".nutrition-left-text",
            ".nutrition-right-text",
          ],
          {
            scale: 0.9,
            y: -40,
            z: -200,
            autoAlpha: 0,
            ease: "power3.in",
            duration: 1.2,
            stagger: 0.05,
          },
        )
        .to(
          ".nutrition-card",
          {
            scale: 0.85,
            borderRadius: cardRadius,
            ease: "expo.inOut",
            duration: 1.8,
          },
          "greenPullback",
        )
        .to({}, { duration: 0.7 })
        .set(".workout-stage", { autoAlpha: 1 })
        .set(".workout-card", {
          width: "100%",
          height: "100%",
          borderRadius: cardRadius,
          scale: 0.85,
          y: stackOffset,
        })
        .to(
          ".nutrition-card",
          {
            y: -offscreenY,
            ease: "none",
            duration: 2,
          },
          "greenExit",
        )
        .to(
          ".workout-card",
          {
            y: 0,
            ease: "none",
            duration: 2,
          },
          "greenExit",
        )
        .set(".nutrition-card", { autoAlpha: 0 })
        .to(".workout-card", {
          scale: 1,
          borderRadius: "0px",
          ease: "power3.inOut",
          duration: 1.5,
        })
        /* ——— Workout card content ——— */
        .fromTo(
          ".workout-mockup-wrapper",
          {
            y: 300,
            z: -500,
            rotationX: 50,
            rotationY: -30,
            autoAlpha: 0,
            scale: 0.6,
          },
          {
            y: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            autoAlpha: 1,
            scale: 1,
            ease: "expo.out",
            duration: 2.5,
          },
          "-=0.8",
        )
        .fromTo(
          ".workout-widget",
          { y: 40, autoAlpha: 0, scale: 0.95 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            stagger: 0.12,
            ease: "back.out(1.2)",
            duration: 1.5,
          },
          "-=1.5",
        )
        .fromTo(
          ".workout-badge",
          { y: 100, autoAlpha: 0, scale: 0.7, rotationZ: -10 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            rotationZ: 0,
            ease: "back.out(1.5)",
            duration: 1.5,
            stagger: 0.2,
          },
          "-=2.0",
        )
        .fromTo(
          ".workout-left-text",
          { x: -50, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, ease: "power4.out", duration: 1.5 },
          "-=1.5",
        )
        .fromTo(
          ".workout-right-text",
          { x: 50, autoAlpha: 0, scale: 0.8 },
          { x: 0, autoAlpha: 1, scale: 1, ease: "expo.out", duration: 1.5 },
          "<",
        )
        .to({}, { duration: 2.5 })
        .set(".hero-text-wrapper", { autoAlpha: 0 })
        .set(".cta-wrapper", { autoAlpha: 1 })
        .to({}, { duration: 1.5 })
        .to(
          [
            ".workout-mockup-wrapper",
            ".workout-badge",
            ".workout-left-text",
            ".workout-right-text",
          ],
          {
            scale: 0.9,
            y: -40,
            z: -200,
            autoAlpha: 0,
            ease: "power3.in",
            duration: 1.2,
            stagger: 0.05,
          },
        )
        .to(
          ".workout-card",
          {
            scale: 0.85,
            borderRadius: cardRadius,
            ease: "expo.inOut",
            duration: 1.8,
          },
          "pullback",
        )
        .to(
          ".cta-wrapper",
          { scale: 1, filter: "blur(0px)", ease: "expo.inOut", duration: 1.8 },
          "pullback",
        )
        .to(".workout-card", {
          y: -offscreenY,
          ease: "power3.in",
          duration: 1.5,
        });
    }, containerRef);

    return () => ctx.revert();
  }, [metricValue]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex h-screen w-screen items-center justify-center overflow-hidden bg-background font-sans text-foreground antialiased",
        className,
      )}
      style={{ perspective: "1500px" }}
    >
      <style dangerouslySetInnerHTML={{ __html: INJECTED_STYLES }} />
      <div className="film-grain" aria-hidden="true" />
      <div
        className="bg-grid-theme pointer-events-none absolute inset-0 z-0 opacity-50"
        aria-hidden="true"
      />

      <div className="hero-text-wrapper transform-style-3d absolute z-10 flex w-screen flex-col items-center justify-center px-6 text-center will-change-transform md:px-10">
        <HeartRateLoader className="absolute top-1/2 left-1/2 z-0 w-[160vw] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-45 md:w-[130vw] md:opacity-50 lg:w-[110vw] lg:opacity-55" />
        <h1 className="relative z-10 mb-1 w-full max-w-5xl md:mb-2">
          <StrokeText
            text={resolvedTagline1}
            strokeColor="var(--mist)"
            fillColor="var(--mist)"
            fontSize={strokeFontSize}
            fontWeight={800}
            letterSpacing={2}
            strokeWidth={1.6}
            drawDuration={3.8}
            fillDelay={0.55}
            stagger={0.09}
            fillMode="wipe"
            trigger="mount"
          />
        </h1>
        <h1 className="relative z-10 mb-6 w-full max-w-6xl md:mb-8">
          <StrokeText
            text={resolvedTagline2}
            strokeColor="var(--mist)"
            fillColor="var(--mist)"
            fontSize={strokeFontSize}
            fontWeight={800}
            letterSpacing={1}
            strokeWidth={1.4}
            drawDuration={3.5}
            delay={1.4}
            fillDelay={0.5}
            stagger={0.08}
            fillMode="wipe"
            trigger="mount"
          />
        </h1>
        <p className="hero-copy-enter relative z-10 mx-auto mb-8 max-w-xl text-base font-light leading-relaxed text-signal md:mb-10 md:text-lg">
          {t("hero.subtitle")}
        </p>
        <button
          type="button"
          onClick={onPrimaryCta}
          aria-label={t("hero.demoAria")}
          className="btn-pill-dark hero-copy-enter relative z-10 pointer-events-auto inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-mist/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:px-8 md:py-4 md:text-base"
        >
          <svg
            className="h-5 w-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          <span>{t("hero.demoCta")}</span>
        </button>
      </div>

      <div className="cta-wrapper gsap-reveal pointer-events-auto absolute z-10 flex w-screen flex-col items-center justify-center px-4 text-center will-change-transform">
        <h2 className="text-silver-matte mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          {resolvedCtaHeading}
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-lg font-light leading-relaxed text-muted-foreground md:text-xl">
          {resolvedCtaDescription}
        </p>
        <div className="flex flex-col gap-6 sm:flex-row">
          <button
            type="button"
            onClick={onPrimaryCta}
            aria-label={t("hero.downloadAria")}
            className="btn-modern-light group flex items-center justify-center gap-3 rounded-[1.25rem] px-8 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="h-8 w-8 transition-transform group-hover:scale-105"
              fill="currentColor"
              viewBox="0 0 384 512"
              aria-hidden="true"
            >
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
            </svg>
            <div className="text-left">
              <div className="mb-[-2px] text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                {t("hero.downloadLabel")}
              </div>
              <div className="text-xl leading-none font-bold tracking-tight">
                {t("hero.downloadCta")}
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={onSecondaryCta}
            aria-label={t("hero.loginAria")}
            className="btn-modern-dark group flex items-center justify-center gap-3 rounded-[1.25rem] px-8 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background"
          >
            <svg
              className="h-6 w-6 transition-transform group-hover:scale-105"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span className="text-xl leading-none font-bold tracking-tight">
              {t("hero.loginCta")}
            </span>
          </button>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{ perspective: "1500px" }}
      >
        <div className="coach-stage absolute inset-0 z-30 flex items-center justify-center">
        <div
          ref={mainCardRef}
          className="main-card premium-depth-card gsap-reveal relative flex h-[92vh] w-[92vw] items-center justify-center overflow-hidden rounded-[32px] pointer-events-auto md:h-[85vh] md:w-[85vw] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-evenly px-4 py-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:px-12 lg:py-0">
            <div className="card-right-text gsap-reveal order-1 z-20 flex w-full justify-center lg:order-3 lg:justify-end">
              <h2 className="text-card-silver-matte text-6xl font-black tracking-tighter uppercase md:text-[6rem] lg:mt-0 lg:text-[8rem]">
                {brandName}
              </h2>
            </div>

            <div
              className="mockup-scroll-wrapper relative order-2 z-10 flex h-95 w-full items-center justify-center lg:order-2 lg:h-150"
              style={{ perspective: "1000px" }}
            >
              <div className="relative flex h-full w-full scale-[0.65] transform items-center justify-center md:scale-85 lg:scale-100">
                <div
                  ref={mockupRef}
                  className="iphone-bezel relative flex h-145 w-70 transform-style-3d flex-col rounded-[3rem] will-change-transform"
                >
                  <div
                    className="hardware-btn absolute top-[120px] -left-[3px] z-0 h-[25px] w-[3px] rounded-l-md"
                    aria-hidden="true"
                  />
                  <div
                    className="hardware-btn absolute top-[160px] -left-[3px] z-0 h-[45px] w-[3px] rounded-l-md"
                    aria-hidden="true"
                  />
                  <div
                    className="hardware-btn absolute top-[220px] -left-[3px] z-0 h-[45px] w-[3px] rounded-l-md"
                    aria-hidden="true"
                  />
                  <div
                    className="hardware-btn absolute top-[170px] -right-[3px] z-0 h-[70px] w-[3px] scale-x-[-1] rounded-r-md"
                    aria-hidden="true"
                  />

                  <div className="absolute inset-1.75 z-10 overflow-hidden rounded-[2.5rem] bg-[#050914] text-white shadow-[inset_0_0_15px_rgba(0,0,0,1)]">
                    <div
                      className="screen-glare pointer-events-none absolute inset-0 z-40"
                      aria-hidden="true"
                    />

                    <div className="absolute top-[5px] left-1/2 z-50 flex h-[28px] w-[100px] -translate-x-1/2 items-center justify-end rounded-full bg-black px-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                    </div>

                    <div className="relative flex h-full w-full flex-col px-5 pt-12 pb-8">
                      <div className="phone-widget mb-8 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="mb-1 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                            {t("hero.today")}
                          </span>
                          <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">
                            {t("hero.plan")}
                          </span>
                        </div>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-bold text-neutral-200 shadow-lg shadow-black/50">
                          FT
                        </div>
                      </div>

                      <div className="phone-widget relative mx-auto mb-8 flex h-44 w-44 items-center justify-center drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                        <svg
                          className="absolute inset-0 h-full w-full"
                          aria-hidden="true"
                        >
                          <circle
                            cx="88"
                            cy="88"
                            r="64"
                            fill="none"
                            stroke="rgba(255,255,255,0.03)"
                            strokeWidth="12"
                          />
                          <circle
                            className="progress-ring"
                            cx="88"
                            cy="88"
                            r="64"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="12"
                          />
                        </svg>
                        <div className="z-10 flex flex-col items-center text-center">
                          <span className="counter-val text-4xl font-extrabold tracking-tighter text-white">
                            0
                          </span>
                          <span className="mt-0.5 text-[8px] font-bold tracking-widest text-blue-200/50 uppercase">
                            {resolvedMetricLabel}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="phone-widget widget-depth flex items-center rounded-2xl p-3">
                          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-linear-to-br from-blue-500/20 to-blue-600/5 shadow-inner">
                            <svg
                              className="h-4 w-4 text-blue-400 drop-shadow-md"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 h-2 w-20 rounded-full bg-neutral-300 shadow-inner" />
                            <div className="h-1.5 w-12 rounded-full bg-neutral-600 shadow-inner" />
                          </div>
                        </div>
                        <div className="phone-widget widget-depth flex items-center rounded-2xl p-3">
                          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-400/20 bg-linear-to-br from-emerald-500/20 to-emerald-600/5 shadow-inner">
                            <svg
                              className="h-4 w-4 text-emerald-400 drop-shadow-md"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 h-2 w-16 rounded-full bg-neutral-300 shadow-inner" />
                            <div className="h-1.5 w-24 rounded-full bg-neutral-600 shadow-inner" />
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-2 left-1/2 h-1 w-30 -translate-x-1/2 rounded-full bg-white/20 shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                    </div>
                  </div>
                </div>

                <div className="floating-badge floating-ui-badge absolute top-6 left-3.75 z-30 flex items-center gap-3 rounded-xl p-3 lg:top-12 lg:-left-20 lg:gap-4 lg:rounded-2xl lg:p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-400/30 bg-linear-to-b from-blue-500/20 to-blue-900/10 shadow-inner lg:h-10 lg:w-10">
                    <span
                      className="text-base drop-shadow-lg lg:text-xl"
                      aria-hidden="true"
                    >
                      🔥
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-tight text-white lg:text-sm">
                      {t("hero.streakTitle")}
                    </p>
                    <p className="text-[10px] font-medium text-blue-200/50 lg:text-xs">
                      {t("hero.streakSubtitle")}
                    </p>
                  </div>
                </div>

                <div className="floating-badge floating-ui-badge absolute -right-3.75 bottom-12 z-30 flex items-center gap-3 rounded-xl p-3 lg:-right-20 lg:bottom-20 lg:gap-4 lg:rounded-2xl lg:p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-400/30 bg-linear-to-b from-indigo-500/20 to-indigo-900/10 shadow-inner lg:h-10 lg:w-10">
                    <span
                      className="text-base drop-shadow-lg lg:text-lg"
                      aria-hidden="true"
                    >
                      💪
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-tight text-white lg:text-sm">
                      {t("hero.planReady")}
                    </p>
                    <p className="text-[10px] font-medium text-blue-200/50 lg:text-xs">
                      {t("hero.planReadySubtitle")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-left-text gsap-reveal order-3 z-20 flex w-full flex-col justify-center px-4 text-center lg:order-1 lg:max-w-none lg:px-0 lg:text-left">
              <h3 className="mb-0 text-2xl font-bold tracking-tight text-white md:text-3xl lg:mb-5 lg:text-4xl">
                {resolvedCardHeading}
              </h3>
              <p className="mx-auto hidden max-w-sm text-sm font-normal leading-relaxed text-blue-100/70 md:block md:text-base lg:mx-0 lg:max-w-none lg:text-lg">
                {resolvedCardDescription}
              </p>
            </div>
          </div>
        </div>
        </div>

        <div className="nutrition-stage pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <div
          ref={nutritionCardRef}
          className="nutrition-card premium-depth-card-green relative flex h-[92vh] w-[92vw] items-center justify-center overflow-hidden rounded-[32px] pointer-events-auto md:h-[85vh] md:w-[85vw] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-evenly px-4 py-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:px-12 lg:py-0">
            <div className="nutrition-right-text gsap-reveal order-1 z-20 flex w-full justify-center lg:order-3 lg:justify-end">
              <h2 className="text-card-silver-matte text-6xl font-black tracking-tighter uppercase md:text-[6rem] lg:mt-0 lg:text-[8rem]">
                {brandName}
              </h2>
            </div>

            <div
              className="nutrition-mockup-wrapper relative order-2 z-10 flex h-95 w-full items-center justify-center lg:order-2 lg:h-150"
              style={{ perspective: "1000px" }}
            >
              <div className="relative flex h-full w-full scale-[0.65] transform items-center justify-center md:scale-85 lg:scale-100">
                <div
                  ref={nutritionMockupRef}
                  className="iphone-bezel relative flex h-145 w-70 transform-style-3d flex-col rounded-[3rem] will-change-transform"
                >
                  <div
                    className="hardware-btn absolute top-[120px] -left-[3px] z-0 h-[25px] w-[3px] rounded-l-md"
                    aria-hidden="true"
                  />
                  <div
                    className="hardware-btn absolute top-[160px] -left-[3px] z-0 h-[45px] w-[3px] rounded-l-md"
                    aria-hidden="true"
                  />
                  <div
                    className="hardware-btn absolute top-[220px] -left-[3px] z-0 h-[45px] w-[3px] rounded-l-md"
                    aria-hidden="true"
                  />
                  <div
                    className="hardware-btn absolute top-[170px] -right-[3px] z-0 h-[70px] w-[3px] scale-x-[-1] rounded-r-md"
                    aria-hidden="true"
                  />

                  <div className="absolute inset-1.75 z-10 overflow-hidden rounded-[2.5rem] bg-[#050e0a] text-white shadow-[inset_0_0_15px_rgba(0,0,0,1)]">
                    <div
                      className="screen-glare pointer-events-none absolute inset-0 z-40"
                      aria-hidden="true"
                    />

                    <div className="absolute top-[5px] left-1/2 z-50 flex h-[28px] w-[100px] -translate-x-1/2 items-center justify-end rounded-full bg-black px-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(46,230,166,0.8)]" />
                    </div>

                    <div className="relative flex h-full w-full flex-col px-5 pt-12 pb-8">
                      <div className="nutrition-widget mb-5 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="mb-1 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                            {t("hero.nutritionToday")}
                          </span>
                          <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">
                            {t("hero.nutritionPlan")}
                          </span>
                        </div>
                        <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-emerald-300">
                          {t("hero.nutritionMonth")}
                        </div>
                      </div>

                      <div className="nutrition-widget mb-5">
                        <div className="mb-2 grid grid-cols-7 gap-1">
                          {weekdays.map((label) => (
                            <span
                              key={label}
                              className="text-center text-[8px] font-bold tracking-wider text-neutral-500 uppercase"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {nutritionDays.map((d) => (
                            <div
                              key={d.day}
                              className={cn(
                                "nutrition-cal-day flex h-9 flex-col items-center justify-center rounded-lg",
                                d.active && "is-active",
                                d.marked && "has-meals",
                              )}
                            >
                              <span
                                className={cn(
                                  "text-[11px] font-semibold",
                                  d.active
                                    ? "text-emerald-200"
                                    : "text-neutral-300",
                                )}
                              >
                                {d.day}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="nutrition-widget mb-4 flex items-center justify-between rounded-2xl border border-emerald-400/15 bg-emerald-500/5 px-3 py-2.5">
                        <div>
                          <p className="text-[9px] font-bold tracking-widest text-emerald-300/60 uppercase">
                            {t("hero.nutritionKcal")}
                          </p>
                          <p className="text-lg font-extrabold tracking-tight text-white">
                            1 840
                          </p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="text-right">
                          <p className="text-[9px] font-bold tracking-widest text-emerald-300/60 uppercase">
                            {t("hero.nutritionProtein")}
                          </p>
                          <p className="text-lg font-extrabold tracking-tight text-white">
                            128g
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {[
                          {
                            title: t("hero.nutritionMeal1"),
                            meta: t("hero.nutritionMeal1Meta"),
                          },
                          {
                            title: t("hero.nutritionMeal2"),
                            meta: t("hero.nutritionMeal2Meta"),
                          },
                          {
                            title: t("hero.nutritionMeal3"),
                            meta: t("hero.nutritionMeal3Meta"),
                          },
                        ].map((meal) => (
                          <div
                            key={meal.title}
                            className="nutrition-widget widget-depth flex items-center rounded-2xl p-2.5"
                          >
                            <div className="mr-2.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-linear-to-br from-emerald-500/25 to-emerald-600/5 shadow-inner">
                              <svg
                                className="h-3.5 w-3.5 text-emerald-400 drop-shadow-md"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M12 6v6l4 2"
                                />
                                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[11px] font-semibold text-white">
                                {meal.title}
                              </p>
                              <p className="truncate text-[9px] text-emerald-200/45">
                                {meal.meta}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="absolute bottom-2 left-1/2 h-1 w-30 -translate-x-1/2 rounded-full bg-white/20 shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                    </div>
                  </div>
                </div>

                <div className="nutrition-badge floating-ui-badge absolute top-6 left-3.75 z-30 flex items-center gap-3 rounded-xl p-3 lg:top-12 lg:-left-20 lg:gap-4 lg:rounded-2xl lg:p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/30 bg-linear-to-b from-emerald-500/20 to-emerald-900/10 shadow-inner lg:h-10 lg:w-10">
                    <span
                      className="text-base drop-shadow-lg lg:text-xl"
                      aria-hidden="true"
                    >
                      🥗
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-tight text-white lg:text-sm">
                      {t("hero.nutritionBadgeCals")}
                    </p>
                    <p className="text-[10px] font-medium text-emerald-200/50 lg:text-xs">
                      {t("hero.nutritionBadgeCalsSub")}
                    </p>
                  </div>
                </div>

                <div className="nutrition-badge floating-ui-badge absolute -right-3.75 bottom-12 z-30 flex items-center gap-3 rounded-xl p-3 lg:-right-20 lg:bottom-20 lg:gap-4 lg:rounded-2xl lg:p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-teal-400/30 bg-linear-to-b from-teal-500/20 to-teal-900/10 shadow-inner lg:h-10 lg:w-10">
                    <span
                      className="text-base drop-shadow-lg lg:text-lg"
                      aria-hidden="true"
                    >
                      🍽️
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-tight text-white lg:text-sm">
                      {t("hero.nutritionBadgeMeals")}
                    </p>
                    <p className="text-[10px] font-medium text-emerald-200/50 lg:text-xs">
                      {t("hero.nutritionBadgeMealsSub")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="nutrition-left-text gsap-reveal order-3 z-20 flex w-full flex-col justify-center px-4 text-center lg:order-1 lg:max-w-none lg:px-0 lg:text-left">
              <h3 className="mb-0 text-2xl font-bold tracking-tight text-white md:text-3xl lg:mb-5 lg:text-4xl">
                {t("hero.nutritionCardHeading")}
              </h3>
              <p className="mx-auto hidden max-w-sm text-sm font-normal leading-relaxed text-emerald-100/70 md:block md:text-base lg:mx-0 lg:max-w-none lg:text-lg">
                {t("hero.nutritionCardDescription")}
              </p>
            </div>
          </div>
        </div>
        </div>

        <div className="workout-stage pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div
          ref={workoutCardRef}
          className="workout-card premium-depth-card-ember relative flex h-[92vh] w-[92vw] items-center justify-center overflow-hidden rounded-[32px] pointer-events-auto md:h-[85vh] md:w-[85vw] md:rounded-[40px]"
        >
          <div className="card-sheen" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-evenly px-4 py-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:px-12 lg:py-0">
            <div className="workout-right-text gsap-reveal order-1 z-20 flex w-full justify-center lg:order-3 lg:justify-end">
              <h2 className="text-card-silver-matte text-6xl font-black tracking-tighter uppercase md:text-[6rem] lg:mt-0 lg:text-[8rem]">
                {brandName}
              </h2>
            </div>

            <div
              className="workout-mockup-wrapper relative order-2 z-10 flex h-95 w-full items-center justify-center lg:order-2 lg:h-150"
              style={{ perspective: "1000px" }}
            >
              <div className="relative flex h-full w-full scale-[0.65] transform items-center justify-center md:scale-85 lg:scale-100">
                <div
                  ref={workoutMockupRef}
                  className="iphone-bezel relative flex h-145 w-70 transform-style-3d flex-col rounded-[3rem] will-change-transform"
                >
                  <div
                    className="hardware-btn absolute top-[120px] -left-[3px] z-0 h-[25px] w-[3px] rounded-l-md"
                    aria-hidden="true"
                  />
                  <div
                    className="hardware-btn absolute top-[160px] -left-[3px] z-0 h-[45px] w-[3px] rounded-l-md"
                    aria-hidden="true"
                  />
                  <div
                    className="hardware-btn absolute top-[220px] -left-[3px] z-0 h-[45px] w-[3px] rounded-l-md"
                    aria-hidden="true"
                  />
                  <div
                    className="hardware-btn absolute top-[170px] -right-[3px] z-0 h-[70px] w-[3px] scale-x-[-1] rounded-r-md"
                    aria-hidden="true"
                  />

                  <div className="absolute inset-1.75 z-10 overflow-hidden rounded-[2.5rem] bg-[#100805] text-white shadow-[inset_0_0_15px_rgba(0,0,0,1)]">
                    <div
                      className="screen-glare pointer-events-none absolute inset-0 z-40"
                      aria-hidden="true"
                    />

                    <div className="absolute top-[5px] left-1/2 z-50 flex h-[28px] w-[100px] -translate-x-1/2 items-center justify-end rounded-full bg-black px-3 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400 shadow-[0_0_8px_rgba(255,90,60,0.8)]" />
                    </div>

                    <div className="relative flex h-full w-full flex-col px-5 pt-12 pb-8">
                      <div className="workout-widget mb-5 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="mb-1 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                            {t("hero.workoutToday")}
                          </span>
                          <span className="text-xl font-bold tracking-tight text-white drop-shadow-md">
                            {t("hero.workoutPlan")}
                          </span>
                        </div>
                        <div className="rounded-full border border-orange-400/25 bg-orange-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wide text-orange-300">
                          {t("hero.workoutMonth")}
                        </div>
                      </div>

                      <div className="workout-widget mb-5">
                        <div className="mb-2 grid grid-cols-7 gap-1">
                          {weekdays.map((label) => (
                            <span
                              key={`w-${label}`}
                              className="text-center text-[8px] font-bold tracking-wider text-neutral-500 uppercase"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {workoutDays.map((d) => (
                            <div
                              key={`w-${d.day}`}
                              className={cn(
                                "workout-cal-day flex h-9 flex-col items-center justify-center rounded-lg",
                                d.active && "is-active",
                                d.marked && "has-sessions",
                              )}
                            >
                              <span
                                className={cn(
                                  "text-[11px] font-semibold",
                                  d.active
                                    ? "text-orange-200"
                                    : "text-neutral-300",
                                )}
                              >
                                {d.day}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="workout-widget mb-4 flex items-center justify-between rounded-2xl border border-orange-400/15 bg-orange-500/5 px-3 py-2.5">
                        <div>
                          <p className="text-[9px] font-bold tracking-widest text-orange-300/60 uppercase">
                            {t("hero.workoutSessions")}
                          </p>
                          <p className="text-lg font-extrabold tracking-tight text-white">
                            4
                          </p>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="text-right">
                          <p className="text-[9px] font-bold tracking-widest text-orange-300/60 uppercase">
                            {t("hero.workoutMinutes")}
                          </p>
                          <p className="text-lg font-extrabold tracking-tight text-white">
                            280
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {[
                          {
                            title: t("hero.workoutSession1"),
                            meta: t("hero.workoutSession1Meta"),
                          },
                          {
                            title: t("hero.workoutSession2"),
                            meta: t("hero.workoutSession2Meta"),
                          },
                          {
                            title: t("hero.workoutSession3"),
                            meta: t("hero.workoutSession3Meta"),
                          },
                        ].map((session) => (
                          <div
                            key={session.title}
                            className="workout-widget widget-depth flex items-center rounded-2xl p-2.5"
                          >
                            <div className="mr-2.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-orange-400/25 bg-linear-to-br from-orange-500/25 to-orange-700/5 shadow-inner">
                              <svg
                                className="h-3.5 w-3.5 text-orange-400 drop-shadow-md"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[11px] font-semibold text-white">
                                {session.title}
                              </p>
                              <p className="truncate text-[9px] text-orange-200/45">
                                {session.meta}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="absolute bottom-2 left-1/2 h-1 w-30 -translate-x-1/2 rounded-full bg-white/20 shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                    </div>
                  </div>
                </div>

                <div className="workout-badge floating-ui-badge absolute top-6 left-3.75 z-30 flex items-center gap-3 rounded-xl p-3 lg:top-12 lg:-left-20 lg:gap-4 lg:rounded-2xl lg:p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-400/30 bg-linear-to-b from-orange-500/20 to-orange-900/10 shadow-inner lg:h-10 lg:w-10">
                    <span
                      className="text-base drop-shadow-lg lg:text-xl"
                      aria-hidden="true"
                    >
                      🔥
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-tight text-white lg:text-sm">
                      {t("hero.workoutBadgeLoad")}
                    </p>
                    <p className="text-[10px] font-medium text-orange-200/50 lg:text-xs">
                      {t("hero.workoutBadgeLoadSub")}
                    </p>
                  </div>
                </div>

                <div className="workout-badge floating-ui-badge absolute -right-3.75 bottom-12 z-30 flex items-center gap-3 rounded-xl p-3 lg:-right-20 lg:bottom-20 lg:gap-4 lg:rounded-2xl lg:p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-red-400/30 bg-linear-to-b from-red-500/20 to-red-900/10 shadow-inner lg:h-10 lg:w-10">
                    <span
                      className="text-base drop-shadow-lg lg:text-lg"
                      aria-hidden="true"
                    >
                      ⏱️
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-tight text-white lg:text-sm">
                      {t("hero.workoutBadgeTime")}
                    </p>
                    <p className="text-[10px] font-medium text-orange-200/50 lg:text-xs">
                      {t("hero.workoutBadgeTimeSub")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="workout-left-text gsap-reveal order-3 z-20 flex w-full flex-col justify-center px-4 text-center lg:order-1 lg:max-w-none lg:px-0 lg:text-left">
              <h3 className="mb-0 text-2xl font-bold tracking-tight text-white md:text-3xl lg:mb-5 lg:text-4xl">
                {t("hero.workoutCardHeading")}
              </h3>
              <p className="mx-auto hidden max-w-sm text-sm font-normal leading-relaxed text-orange-100/70 md:block md:text-base lg:mx-0 lg:max-w-none lg:text-lg">
                {t("hero.workoutCardDescription")}
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
