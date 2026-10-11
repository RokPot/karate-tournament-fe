import type {
  CoachDetails,
  DraftParticipant,
  DraftTeam,
  RegistrantMode,
} from "../types";

export type RegistrationDraftPayload = {
  mode: RegistrantMode | null;
  contactDetails: CoachDetails | null;
  participants: DraftParticipant[];
  teams: DraftTeam[];
};

const storageKey = (tournamentId: string) =>
  `registration-draft:${tournamentId}`;

export function loadRegistrationDraft(
  tournamentId: string,
): RegistrationDraftPayload | null {
  if (typeof window === "undefined" || !tournamentId) {
    return null;
  }
  try {
    const raw = sessionStorage.getItem(storageKey(tournamentId));
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as RegistrationDraftPayload;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return {
      mode: parsed.mode ?? null,
      contactDetails: parsed.contactDetails ?? null,
      participants: Array.isArray(parsed.participants)
        ? parsed.participants
        : [],
      teams: Array.isArray(parsed.teams) ? parsed.teams : [],
    };
  } catch {
    return null;
  }
}

export function saveRegistrationDraft(
  tournamentId: string,
  draft: RegistrationDraftPayload,
): void {
  if (typeof window === "undefined" || !tournamentId) {
    return;
  }
  try {
    sessionStorage.setItem(storageKey(tournamentId), JSON.stringify(draft));
  } catch {
    // Quota / private mode — ignore
  }
}

export function clearRegistrationDraft(tournamentId: string): void {
  if (typeof window === "undefined" || !tournamentId) {
    return;
  }
  try {
    sessionStorage.removeItem(storageKey(tournamentId));
  } catch {
    // ignore
  }
}
