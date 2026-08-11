import { LaunchCountdown } from "@/components/launch/LaunchCountdown";
import { getLaunchState } from "@/lib/launch";
import type { ReactNode } from "react";

type LaunchGateProps = {
  children?: ReactNode;
  now?: number;
};

export function LaunchGate({ children, now }: LaunchGateProps) {
  const serverNow = now ?? Date.now();
  const state = getLaunchState({ now: serverNow });

  if (state.launched || !state.launchAt) {
    return <>{children}</>;
  }

  return <LaunchCountdown launchAt={state.launchAt} serverNow={serverNow} />;
}
