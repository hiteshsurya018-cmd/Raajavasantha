"use client";

import * as React from "react";
import { formatLaunchClock, getLaunchState } from "@/lib/launch";
import { lovableAssets } from "@/lib/lovable-assets";

type LaunchCountdownProps = {
  launchAt: string;
  serverNow: number;
};

function splitRemaining(remainingMs: number) {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

/* ============================================================
   PREMIUM CELEBRATION PARTICLES
   ============================================================ */

const PARTICLES = Array.from({ length: 54 }, (_, index) => {
  const angle = (index / 54) * 360;
  const distance = 100 + ((index * 41) % 280);
  const delay = (index % 12) * 0.045;
  const size = 1 + (index % 3);

  return {
    id: index,
    angle,
    distance,
    delay,
    size,
  };
});

export function LaunchCountdown({
  launchAt,
  serverNow,
}: LaunchCountdownProps) {
  const origin = React.useRef<{
    serverNow: number;
    perfNow: number;
  } | null>(null);

  const celebrationStarted = React.useRef(false);
  const reloadTimer = React.useRef<number | null>(null);

  const [nowMs, setNowMs] = React.useState(serverNow);
  const [celebrating, setCelebrating] = React.useState(false);

  /* ============================================================
     SYNCHRONIZE COUNTDOWN WITH SERVER TIME
     ============================================================ */

  React.useEffect(() => {
    origin.current = {
      serverNow,
      perfNow: performance.now(),
    };

    const update = () => {
      if (!origin.current) return;

      const elapsed = performance.now() - origin.current.perfNow;

      setNowMs(origin.current.serverNow + elapsed);
    };

    update();

    const intervalId = window.setInterval(update, 200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [serverNow]);

  /* ============================================================
     LAUNCH STATE
     ============================================================ */

  const state = getLaunchState({
    now: nowMs,
    launchAt,
  });

  const remaining = splitRemaining(state.remainingMs);

  const finalTen =
    !state.launched &&
    state.remainingMs > 0 &&
    state.remainingMs <= 10_000;

  const finalNumber = Math.max(
    1,
    Math.ceil(state.remainingMs / 1000)
  );

  /* ============================================================
     START 8-SECOND CELEBRATION
     ============================================================ */

  React.useEffect(() => {
    if (!state.launched) return;
    if (celebrationStarted.current) return;

    celebrationStarted.current = true;

    /*
      8-second launch sequence

      0.00s  celebration starts
      0.00s  gold blaster + particles
      0.55s  logo reveal
      0.85s  trust name reveal
      1.20s  WE BEGIN.
      2.00s  gold line expands
      2.45s  supporting message
      2.90s  decorative accent
      3–8s   subtle ambient celebration
      8.00s  homepage reload
    */

    setCelebrating(true);

    reloadTimer.current = window.setTimeout(() => {
      window.location.reload();
    }, 8000);

    return () => {
      if (reloadTimer.current !== null) {
        window.clearTimeout(reloadTimer.current);
      }
    };
  }, [state.launched]);

  /* ============================================================
     PREMIUM 8-SECOND CELEBRATION
     ============================================================ */

  if (celebrating) {
    return (
      <main className="launch-celebration fixed inset-0 z-[300] flex min-h-screen items-center justify-center overflow-hidden bg-[#10291C] px-5 text-[#F7F2E7]">
        {/* Ambient green / gold glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
        >
          <div className="launch-ambient-glow absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full" />

          <div className="launch-ambient-glow-secondary absolute left-1/2 top-[70%] h-[35vh] w-[75vw] -translate-x-1/2 rounded-full" />
        </div>

        {/* Gold particle field */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {PARTICLES.map((particle) => {
            const particleStyle = {
              "--particle-angle": `${particle.angle}deg`,
              "--particle-distance": `${particle.distance}px`,
              "--particle-delay": `${particle.delay}s`,
              "--particle-size": `${particle.size}px`,
            } as React.CSSProperties;

            return (
              <span
                key={particle.id}
                className="launch-particle absolute left-1/2 top-1/2 rounded-full bg-[#E6C77A]"
                style={particleStyle}
              />
            );
          })}
        </div>

        {/* Soft premium gold blaster */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[8%] left-1/2 h-[55vh] w-[90vw] -translate-x-1/2"
        >
          <div className="launch-blast launch-blast-left" />
          <div className="launch-blast launch-blast-right" />
          <div className="launch-blast launch-blast-left-2" />
          <div className="launch-blast launch-blast-right-2" />

          <div className="launch-blast-core" />
          <div className="launch-ground-glow" />
        </div>

        {/* Main celebration content */}
        <section className="relative z-20 flex w-full max-w-4xl flex-col items-center text-center">
          {/* Logo */}
          <div className="launch-logo flex h-[4.7rem] w-[4.7rem] items-center justify-center rounded-full bg-[#F7F2E7] p-2.5 sm:h-[5.5rem] sm:w-[5.5rem]">
            <img
              src={lovableAssets.logo.url}
              alt="Rajavasantha Welfare Trust logo"
              width={88}
              height={88}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Trust name */}
          <div className="launch-brand mt-4">
            <p className="font-display text-[1.15rem] uppercase tracking-[0.15em] text-[#F7F2E7] sm:text-[1.4rem]">
              Rajavasantha
            </p>

            <p className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.38em] text-[#D1A94A] sm:text-[0.65rem]">
              Welfare Trust
            </p>

            <p className="mt-3 text-[0.48rem] font-semibold uppercase tracking-[0.25em] text-[#F7F2E7]/45">
              Registered Charitable Trust
            </p>
          </div>

          {/* WE BEGIN */}
          <div className="launch-message mt-10 sm:mt-12">
            <p className="font-display text-[clamp(3.4rem,9vw,7rem)] font-semibold leading-[0.9] tracking-[-0.025em] text-[#F7F2E7]">
              WE BEGIN.
            </p>
          </div>

          {/* Gold line */}
          <div className="launch-gold-line mt-7 h-px w-0 bg-[#D1A94A]" />

          {/* Supporting message */}
          <p className="launch-subtitle mt-6 text-sm tracking-[0.08em] text-[#F7F2E7]/70 sm:text-base">
            A new chapter of service begins.
          </p>

          {/* Decorative accent */}
          <div className="launch-accent mt-6 flex items-center gap-2">
            <span className="h-px w-8 bg-[#D1A94A]/50" />

            <span className="text-[0.65rem] text-[#D1A94A]">
              ✦
            </span>

            <span className="h-px w-8 bg-[#D1A94A]/50" />
          </div>
        </section>

        {/* Expanding bottom gold line */}
        <div
          aria-hidden="true"
          className="launch-bottom-line absolute bottom-0 left-1/2 h-px w-0 -translate-x-1/2 bg-[#D1A94A]"
        />

        {/* ======================================================
            ANIMATIONS
            ====================================================== */}

        <style jsx>{`
          .launch-celebration {
            animation: celebrationFadeIn 0.45s ease-out both;
          }

          /* Ambient background */

          .launch-ambient-glow {
            background:
              radial-gradient(
                circle,
                rgba(201, 154, 50, 0.16) 0%,
                rgba(201, 154, 50, 0.07) 28%,
                transparent 68%
              );
            filter: blur(25px);
            animation: ambientPulse 8s ease-in-out both;
          }

          .launch-ambient-glow-secondary {
            background:
              radial-gradient(
                ellipse,
                rgba(48, 101, 69, 0.24) 0%,
                transparent 70%
              );
            filter: blur(40px);
            animation: ambientPulseSecondary 8s ease-in-out both;
          }

          /* Particles */

          .launch-particle {
            width: var(--particle-size);
            height: var(--particle-size);
            opacity: 0;
            box-shadow:
              0 0 6px rgba(230, 199, 122, 0.8),
              0 0 14px rgba(230, 199, 122, 0.35);
            animation:
              particleBurst 3.2s
              cubic-bezier(0.16, 0.72, 0.25, 1)
              var(--particle-delay)
              both;
          }

          /* Gold blaster */

          .launch-blast {
            position: absolute;
            bottom: 0;
            width: 2px;
            height: 2px;
            border-radius: 999px;
            background: #e6c77a;
            box-shadow:
              0 0 5px rgba(230, 199, 122, 0.95),
              0 0 14px rgba(230, 199, 122, 0.65),
              0 0 32px rgba(230, 199, 122, 0.3);
            transform-origin: bottom center;
          }

          .launch-blast-left {
            left: 44%;
            animation: blastLeft 3s ease-out both;
          }

          .launch-blast-right {
            left: 56%;
            animation: blastRight 3s ease-out both;
          }

          .launch-blast-left-2 {
            left: 47%;
            animation:
              blastLeftSecondary
              3.4s
              ease-out
              0.15s
              both;
          }

          .launch-blast-right-2 {
            left: 53%;
            animation:
              blastRightSecondary
              3.4s
              ease-out
              0.15s
              both;
          }

          .launch-blast-core {
            position: absolute;
            bottom: -10px;
            left: 50%;
            width: 100px;
            height: 100px;
            transform: translateX(-50%);
            border-radius: 999px;
            background:
              radial-gradient(
                circle,
                rgba(230, 199, 122, 0.3),
                rgba(230, 199, 122, 0.08) 35%,
                transparent 72%
              );
            filter: blur(9px);
            animation: coreFlash 2.5s ease-out both;
          }

          .launch-ground-glow {
            position: absolute;
            bottom: -20px;
            left: 50%;
            width: min(560px, 78vw);
            height: 80px;
            transform: translateX(-50%);
            border-radius: 50%;
            background:
              radial-gradient(
                ellipse,
                rgba(230, 199, 122, 0.25),
                transparent 70%
              );
            filter: blur(16px);
            animation: groundGlow 6s ease-out both;
          }

          /* Logo */

          .launch-logo {
            opacity: 0;
            transform: scale(0.72);
            box-shadow:
              0 0 0 rgba(230, 199, 122, 0),
              0 0 0 rgba(230, 199, 122, 0);

            animation:
              logoReveal
                1.1s
                cubic-bezier(0.16, 1, 0.3, 1)
                0.55s
                forwards,
              logoBreathing
                3s
                ease-in-out
                2.5s
                infinite;
          }

          /* Trust name */

          .launch-brand {
            opacity: 0;
            transform: translateY(12px);
            animation:
              brandReveal
              0.8s
              ease-out
              0.85s
              forwards;
          }

          /* WE BEGIN */

          .launch-message {
            opacity: 0;
            transform:
              translateY(18px)
              scale(0.97);

            animation:
              messageReveal
              0.95s
              cubic-bezier(0.16, 1, 0.3, 1)
              1.2s
              forwards;
          }

          /* Gold line */

          .launch-gold-line {
            animation:
              lineExpand
              1s
              cubic-bezier(0.16, 1, 0.3, 1)
              2s
              forwards;
          }

          /* Supporting message */

          .launch-subtitle {
            opacity: 0;
            transform: translateY(10px);
            animation:
              subtitleReveal
              0.75s
              ease-out
              2.45s
              forwards;
          }

          /* Decorative accent */

          .launch-accent {
            opacity: 0;
            animation:
              accentReveal
              0.6s
              ease-out
              2.9s
              forwards;
          }

          /* Bottom line */

          .launch-bottom-line {
            animation:
              bottomLineExpand
              1.1s
              cubic-bezier(0.16, 1, 0.3, 1)
              2.15s
              forwards;
          }

          /* ======================================================
             KEYFRAMES
             ====================================================== */

          @keyframes celebrationFadeIn {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes ambientPulse {
            0% {
              opacity: 0;
              transform:
                translate(-50%, -50%)
                scale(0.7);
            }

            25% {
              opacity: 1;
            }

            60% {
              opacity: 0.85;
            }

            100% {
              opacity: 0.65;
              transform:
                translate(-50%, -50%)
                scale(1.18);
            }
          }

          @keyframes ambientPulseSecondary {
            0% {
              opacity: 0;
              transform:
                translate(-50%, 0)
                scale(0.7);
            }

            35% {
              opacity: 0.8;
            }

            70% {
              opacity: 0.55;
            }

            100% {
              opacity: 0.35;
              transform:
                translate(-50%, 0)
                scale(1.2);
            }
          }

          @keyframes particleBurst {
            0% {
              opacity: 0;
              transform:
                translate(-50%, -50%)
                rotate(var(--particle-angle))
                translateY(0)
                scale(0.4);
            }

            10% {
              opacity: 1;
            }

            40% {
              opacity: 0.9;
            }

            68% {
              opacity: 0.65;
            }

            100% {
              opacity: 0;
              transform:
                translate(-50%, -50%)
                rotate(var(--particle-angle))
                translateY(
                  calc(
                    var(--particle-distance) * -1
                  )
                )
                scale(0.1);
            }
          }

          @keyframes blastLeft {
            0% {
              opacity: 0;
              transform:
                rotate(-8deg)
                scaleY(0.1);
            }

            10% {
              opacity: 1;
            }

            45% {
              opacity: 0.8;
            }

            100% {
              opacity: 0;
              transform:
                rotate(-52deg)
                scaleY(180);
            }
          }

          @keyframes blastRight {
            0% {
              opacity: 0;
              transform:
                rotate(8deg)
                scaleY(0.1);
            }

            10% {
              opacity: 1;
            }

            45% {
              opacity: 0.8;
            }

            100% {
              opacity: 0;
              transform:
                rotate(52deg)
                scaleY(180);
            }
          }

          @keyframes blastLeftSecondary {
            0% {
              opacity: 0;
              transform:
                rotate(-4deg)
                scaleY(0.1);
            }

            12% {
              opacity: 0.75;
            }

            100% {
              opacity: 0;
              transform:
                rotate(-38deg)
                scaleY(130);
            }
          }

          @keyframes blastRightSecondary {
            0% {
              opacity: 0;
              transform:
                rotate(4deg)
                scaleY(0.1);
            }

            12% {
              opacity: 0.75;
            }

            100% {
              opacity: 0;
              transform:
                rotate(38deg)
                scaleY(130);
            }
          }

          @keyframes coreFlash {
            0% {
              opacity: 0;
              transform:
                translateX(-50%)
                scale(0.3);
            }

            12% {
              opacity: 1;
              transform:
                translateX(-50%)
                scale(1.2);
            }

            45% {
              opacity: 0.55;
            }

            100% {
              opacity: 0;
              transform:
                translateX(-50%)
                scale(2.5);
            }
          }

          @keyframes groundGlow {
            0% {
              opacity: 0;
              transform:
                translateX(-50%)
                scaleX(0.25);
            }

            20% {
              opacity: 1;
            }

            55% {
              opacity: 0.7;
            }

            100% {
              opacity: 0.2;
              transform:
                translateX(-50%)
                scaleX(1.3);
            }
          }

          @keyframes logoReveal {
            0% {
              opacity: 0;
              transform: scale(0.72);
              box-shadow:
                0 0 0 rgba(230, 199, 122, 0),
                0 0 0 rgba(230, 199, 122, 0);
            }

            55% {
              opacity: 1;
              transform: scale(1.08);
              box-shadow:
                0 0 35px rgba(230, 199, 122, 0.22),
                0 0 90px rgba(230, 199, 122, 0.1);
            }

            100% {
              opacity: 1;
              transform: scale(1);
              box-shadow:
                0 0 20px rgba(230, 199, 122, 0.12),
                0 0 55px rgba(230, 199, 122, 0.06);
            }
          }

          @keyframes logoBreathing {
            0% {
              box-shadow:
                0 0 18px rgba(230, 199, 122, 0.1),
                0 0 45px rgba(230, 199, 122, 0.04);
            }

            50% {
              box-shadow:
                0 0 28px rgba(230, 199, 122, 0.2),
                0 0 70px rgba(230, 199, 122, 0.08);
            }

            100% {
              box-shadow:
                0 0 18px rgba(230, 199, 122, 0.1),
                0 0 45px rgba(230, 199, 122, 0.04);
            }
          }

          @keyframes brandReveal {
            from {
              opacity: 0;
              transform: translateY(12px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes messageReveal {
            0% {
              opacity: 0;
              transform:
                translateY(18px)
                scale(0.97);
            }

            100% {
              opacity: 1;
              transform:
                translateY(0)
                scale(1);
            }
          }

          @keyframes lineExpand {
            from {
              width: 0;
              opacity: 0;
            }

            to {
              width: min(360px, 65vw);
              opacity: 1;
            }
          }

          @keyframes subtitleReveal {
            from {
              opacity: 0;
              transform: translateY(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes accentReveal {
            from {
              opacity: 0;
              transform: translateY(5px);
            }

            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bottomLineExpand {
            from {
              width: 0;
              opacity: 0;
            }

            to {
              width: min(760px, 75vw);
              opacity: 0.65;
            }
          }

          /* ======================================================
             MOBILE
             ====================================================== */

          @media (max-width: 640px) {
            .launch-particle {
              box-shadow:
                0 0 5px rgba(230, 199, 122, 0.7),
                0 0 10px rgba(230, 199, 122, 0.25);
            }

            .launch-blast {
              opacity: 0.75;
            }
          }

          /* ======================================================
             ACCESSIBILITY
             ====================================================== */

          @media (prefers-reduced-motion: reduce) {
            .launch-celebration *,
            .launch-celebration {
              animation-duration: 0.01ms !important;
              animation-delay: 0ms !important;
              animation-iteration-count: 1 !important;
            }
          }
        `}</style>
      </main>
    );
  }

  /* ============================================================
     FINAL 10 SECONDS
     ============================================================ */

  if (finalTen) {
    return (
      <main className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center overflow-hidden bg-[#163021] px-5 py-6 text-[#F7F2E7]">
        <div
          aria-hidden="true"
          className="absolute inset-x-[-10%] top-[-30%] h-[45vh] rounded-full bg-[#C99A32]/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 h-px w-[min(700px,72vw)] -translate-x-1/2 bg-[#C99A32]/50"
        />

        <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          {/* Logo */}

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F7F2E7] p-2.5 sm:h-16 sm:w-16">
            <img
              src={lovableAssets.logo.url}
              alt="Rajavasantha Welfare Trust logo"
              width={64}
              height={64}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Name */}

          <p className="mt-3 font-display text-base uppercase tracking-[0.14em] text-[#F7F2E7] sm:text-lg">
            Rajavasantha
          </p>

          <p className="mt-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.32em] text-[#C99A32]">
            Welfare Trust
          </p>

          {/* Final countdown */}

          <div className="mt-10">
            <p
              aria-live="polite"
              aria-atomic="true"
              className="font-display text-[clamp(6rem,22vw,12rem)] font-semibold leading-none tabular-nums"
            >
              {finalNumber}
            </p>

            <p className="mt-5 text-xs uppercase tracking-[0.22em] text-[#F7F2E7]/60">
              Preparing something meaningful
            </p>
          </div>
        </section>
      </main>
    );
  }

  /* ============================================================
     NORMAL COUNTDOWN
     ============================================================ */

  return (
    <main className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center overflow-hidden bg-[#163021] px-5 py-6 text-[#F7F2E7]">
      {/* Background glow */}

      <div
        aria-hidden="true"
        className="absolute inset-x-[-10%] top-[-30%] h-[45vh] rounded-full bg-[#C99A32]/10 blur-3xl"
      />

      {/* Bottom gold line */}

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 h-px w-[min(700px,72vw)] -translate-x-1/2 bg-[#C99A32]/50"
      />

      <section className="relative mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        {/* Brand */}

        <div className="flex flex-col items-center">
          {/* Logo */}

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F7F2E7] p-2.5 sm:h-[4.5rem] sm:w-[4.5rem]">
            <img
              src={lovableAssets.logo.url}
              alt="Rajavasantha Welfare Trust logo"
              width={72}
              height={72}
              className="h-full w-full object-contain"
            />
          </div>

          {/* Trust name */}

          <div className="mt-3">
            <p className="font-display text-[1.15rem] uppercase tracking-[0.13em] text-[#F7F2E7] sm:text-[1.35rem]">
              Rajavasantha
            </p>

            <p className="mt-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.36em] text-[#C99A32] sm:text-[0.65rem]">
              Welfare Trust
            </p>

            <p className="mt-2 text-[0.5rem] font-semibold uppercase tracking-[0.22em] text-[#F7F2E7]/45">
              Registered Charitable Trust
            </p>
          </div>
        </div>

        {/* Main headline */}

        <h1 className="mt-8 max-w-3xl text-balance font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-semibold leading-[0.98]">
          A new chapter
          <span className="block">
            of service begins.
          </span>
        </h1>

        {/* Launch time card */}

        <div className="mt-8 rounded-[14px] border border-[#F7F2E7]/18 bg-[#F7F2E7]/[0.045] px-7 py-5 backdrop-blur-sm">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-[#F7F2E7]/50">
            Launching at
          </p>

          <p className="mt-2 font-display text-3xl font-semibold text-[#C99A32] sm:text-4xl">
            {formatLaunchClock(launchAt)}
          </p>

          <p className="mt-1.5 text-xs text-[#F7F2E7]/60">
            13 August 2026 · IST
          </p>
        </div>

        {/* Countdown */}

        <dl className="mt-8 grid grid-cols-4 gap-4 text-center sm:gap-8">
          {[
            ["Days", remaining.days],
            ["Hours", remaining.hours],
            ["Minutes", remaining.minutes],
            ["Seconds", remaining.seconds],
          ].map(([label, value]) => (
            <div
              key={label}
              className="min-w-12 sm:min-w-16"
            >
              <dt className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-[#F7F2E7]/40 sm:text-[0.6rem]">
                {label}
              </dt>

              <dd className="mt-1.5 font-display text-2xl font-semibold tabular-nums text-[#F7F2E7] sm:text-3xl">
                {String(value).padStart(2, "0")}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}