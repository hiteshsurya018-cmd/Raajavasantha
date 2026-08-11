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

function currentMs(now: number | Date | undefined) {
  if (now instanceof Date) return now.getTime();
  return typeof now === "number" ? now : Date.now();
}

export function parseLaunchAt(launchAt: string | null | undefined) {
  if (!launchAt) return null;
  const parsed = Date.parse(launchAt);
  return Number.isFinite(parsed) ? parsed : null;
}

export function getLaunchState(options: LaunchStateOptions = {}): LaunchState {
  const launchAt =
    options.launchAt ??
    process.env.NEXT_PUBLIC_LAUNCH_AT ??
    null;
  const launchAtMs = parseLaunchAt(launchAt);
  const nowMs = currentMs(options.now);

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
