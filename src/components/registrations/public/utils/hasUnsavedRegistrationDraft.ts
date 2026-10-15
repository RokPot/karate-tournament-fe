import { loadRegistrationDraft } from "./registrationDraftStorage";

export function hasUnsavedRegistrationDraft(tournamentId: string): boolean {
  const stored = loadRegistrationDraft(tournamentId);
  if (!stored) {
    return false;
  }
  return stored.participants.length > 0 || stored.teams.length > 0;
}
