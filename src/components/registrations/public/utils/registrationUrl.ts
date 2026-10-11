import type { NextRouter } from "next/router";

import {
  isRegistrantMode,
  isRegistrationFlowStep,
  type RegistrantMode,
  type RegistrationFlowStep,
} from "../types";

export type RegistrationUrlState = {
  mode: RegistrantMode | null;
  step: RegistrationFlowStep | null;
};

export function parseRegistrationUrlQuery(
  query: NextRouter["query"],
): RegistrationUrlState {
  const modeRaw = query.mode;
  const stepRaw = query.step;
  const mode = isRegistrantMode(modeRaw) ? modeRaw : null;
  const step = isRegistrationFlowStep(stepRaw) ? stepRaw : null;

  if (!mode) {
    return { mode: null, step: null };
  }
  if (!step) {
    return { mode, step: "contact" };
  }
  return { mode, step };
}

export function buildRegistrationQuery(
  tournamentId: string,
  state: { mode: RegistrantMode; step: RegistrationFlowStep },
): Record<string, string> {
  return {
    id: tournamentId,
    mode: state.mode,
    step: state.step,
  };
}

export async function pushRegistrationStep(
  router: NextRouter,
  tournamentId: string,
  mode: RegistrantMode,
  step: RegistrationFlowStep,
): Promise<boolean> {
  return router.push(
    {
      pathname: router.pathname,
      query: buildRegistrationQuery(tournamentId, { mode, step }),
    },
    undefined,
    { shallow: true },
  );
}

export async function replaceRegistrationStep(
  router: NextRouter,
  tournamentId: string,
  mode: RegistrantMode,
  step: RegistrationFlowStep,
): Promise<boolean> {
  return router.replace(
    {
      pathname: router.pathname,
      query: buildRegistrationQuery(tournamentId, { mode, step }),
    },
    undefined,
    { shallow: true },
  );
}

export async function clearRegistrationUrl(
  router: NextRouter,
  tournamentId: string,
): Promise<boolean> {
  return router.replace(
    {
      pathname: router.pathname,
      query: { id: tournamentId },
    },
    undefined,
    { shallow: true },
  );
}

export function progressIndexForStep(step: RegistrationFlowStep): number {
  switch (step) {
    case "contact":
      return 0;
    case "participants":
      return 1;
    case "categories":
      return 2;
    case "review":
      return 3;
    case "results":
      return 3;
    default:
      return 0;
  }
}

export function wizardStepForFlowStep(
  step: RegistrationFlowStep,
): "contact" | "participants" | "categories" | "results" {
  if (step === "review") {
    return "categories";
  }
  return step;
}
