"use client";

import * as React from "react";
import { formatLaunchClock, getLaunchState } from "@/lib/launch";

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
  return { days, hours, minutes, seconds };
}

export function LaunchCountdown({ launchAt, serverNow }: LaunchCountdownProps) {
  const origin = React.useRef<{ serverNow: number; perfNow: number } | null>(null);
  const reloaded = React.useRef(false);
  const [nowMs, setNowMs] = React.useState(serverNow);

  React.useEffect(() => {
    origin.current = {
      serverNow,
      perfNow: performance.now(),
    };

    function update() {
      if (!origin.current) return;
      setNowMs(origin.current.serverNow + performance.now() - origin.current.perfNow);
    }

    update();
    const id = window.setInterval(update, 200);
    return () => window.clearInterval(id);
  }, [serverNow]);

  const state = getLaunchState({ now: nowMs, launchAt });
  const remaining = splitRemaining(state.remainingMs);
  const finalTen = state.remainingMs > 0 && state.remainingMs <= 10_000;
  const finalNumber = Math.max(1, Math.ceil(state.remainingMs / 1000));

  React.useEffect(() => {
    if (!state.launched || reloaded.current) return;
    if (state.launchAtMs !== null && nowMs - state.launchAtMs >= 900) {
      reloaded.current = true;
      window.location.reload();
    }
  }, [nowMs, state.launched, state.launchAtMs]);

  return (
    <main className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center overflow-hidden bg-[#163021] px-6 text-[#F7F2E7]">
      <div
        aria-hidden
        className="absolute inset-x-[-10%] top-[-30%] h-[55vh] rounded-full bg-[#C99A32]/10 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 h-px w-[min(760px,72vw)] -translate-x-1/2 bg-[#C99A32]/50"
      />

      <section className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#C99A32]">
          RAJAVASANTHA
        </p>

        {state.launched ? (
          <div className="mt-10">
            <p className="font-display text-[clamp(3rem,12vw,7rem)] font-semibold leading-none">
              WE BEGIN.
            </p>
            <p className="mt-8 text-sm uppercase tracking-[0.24em] text-[#F7F2E7]/70">
              Rajavasantha Welfare Trust
            </p>
          </div>
        ) : finalTen ? (
          <div className="mt-10">
            <p
              aria-live="polite"
              className="font-display text-[clamp(5.5rem,24vw,13rem)] font-semibold leading-none text-[#F7F2E7]"
            >
              {finalNumber}
            </p>
            <p className="mt-8 text-sm uppercase tracking-[0.24em] text-[#F7F2E7]/70">
              Preparing something meaningful
            </p>
          </div>
        ) : (
          <>
            <h1 className="mt-8 text-balance font-display text-[clamp(2.7rem,8vw,5.8rem)] font-semibold leading-[0.98]">
              A new chapter of service begins.
            </h1>
            <div className="mt-10 rounded-[14px] border border-[#F7F2E7]/12 bg-[#F7F2E7]/5 px-7 py-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F7F2E7]/55">
                Launching at
              </p>
              <p className="mt-3 font-display text-4xl font-semibold text-[#C99A32]">
                {formatLaunchClock(launchAt)}
              </p>
              <p className="mt-2 text-sm text-[#F7F2E7]/65">Today, IST</p>
            </div>
            <dl className="mt-10 grid grid-cols-4 gap-3 text-center sm:gap-5">
              {[
                ["Days", remaining.days],
                ["Hours", remaining.hours],
                ["Minutes", remaining.minutes],
                ["Seconds", remaining.seconds],
              ].map(([label, value]) => (
                <div key={label} className="min-w-16">
                  <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-[#F7F2E7]/50">
                    {label}
                  </dt>
                  <dd className="mt-2 font-display text-3xl font-semibold tabular-nums text-[#F7F2E7] sm:text-4xl">
                    {String(value).padStart(2, "0")}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}
      </section>
    </main>
  );
}
