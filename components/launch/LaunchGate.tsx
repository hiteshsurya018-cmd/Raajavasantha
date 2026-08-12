import { LaunchCountdown } from "@/components/launch/LaunchCountdown";
import { getLaunchState } from "@/lib/launch";
import type { ReactNode } from "react";

type LaunchGateProps = {
  children?: ReactNode;
  now?: number;
};

export function LaunchGate({
  children,
  now,
}: LaunchGateProps) {
  /**
   * Capture the current server time.
   *
   * If a time is explicitly provided, it is used instead.
   * This also makes the component easier to test.
   */
  const serverNow = now ?? Date.now();

  /**
   * Read the configured launch time and determine whether
   * the website should currently be locked or accessible.
   */
  const state = getLaunchState({
    now: serverNow,
  });

  /**
   * Once the launch time has arrived, immediately render
   * the real website.
   */
  if (state.launched || !state.launchAt) {
    return <>{children}</>;
  }

  /**
   * Before launch, display the full-screen countdown.
   */
  return (
    <LaunchCountdown
      launchAt={state.launchAt}
      serverNow={serverNow}
    />
  );
}