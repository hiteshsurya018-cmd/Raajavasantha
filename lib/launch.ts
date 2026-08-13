export type LaunchState = {
  launched: boolean;
  launchAt: string | null;
  launchAtMs: number | null;
  remainingMs: number;
  invalidConfig: boolean;
};

type LaunchStateOptions = {
  now?: number | Date;
  launchAt?: string | null;
};

/**
 * Official website launch time:
 *
 * 13 August 2026
 * 11:00 AM
 * India Standard Time (UTC+05:30)
 */
const DEFAULT_LAUNCH_AT = "2026-08-13T12:15:00+05:30";

function currentMs(now: number | Date | undefined) {
  if (now instanceof Date) {
    return now.getTime();
  }

  return typeof now === "number" ? now : Date.now();
}

export function parseLaunchAt(
  launchAt: string | null | undefined
) {
  if (!launchAt) {
    return null;
  }

  const parsed = Date.parse(launchAt);

  return Number.isFinite(parsed) ? parsed : null;
}

export function getLaunchState(
  options: LaunchStateOptions = {}
): LaunchState {
  /**
   * Priority:
   *
   * 1. Explicit launchAt passed to the function
   * 2. NEXT_PUBLIC_LAUNCH_AT environment variable
   * 3. Official hard-coded launch time
   */
  const launchAt =
    options.launchAt ??
    process.env.NEXT_PUBLIC_LAUNCH_AT ??
    DEFAULT_LAUNCH_AT;

  const launchAtMs = parseLaunchAt(launchAt);

  const nowMs = currentMs(options.now);

  /**
   * Invalid configuration should never accidentally
   * lock the website.
   */
  if (!launchAt || launchAtMs === null) {
    return {
      launched: true,
      launchAt: launchAt ?? null,
      launchAtMs: null,
      remainingMs: 0,
      invalidConfig: Boolean(launchAt),
    };
  }

  const remainingMs = launchAtMs - nowMs;

  return {
    launched: remainingMs <= 0,
    launchAt,
    launchAtMs,
    remainingMs: Math.max(0, remainingMs),
    invalidConfig: false,
  };
}

export function formatLaunchClock(launchAt: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(launchAt));
}