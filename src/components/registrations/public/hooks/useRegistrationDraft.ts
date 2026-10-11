import { useCallback, useEffect, useRef, useState } from "react";

import type { CoachDetails, DraftParticipant, DraftTeam } from "../types";
import {
  clearRegistrationDraft,
  loadRegistrationDraft,
  saveRegistrationDraft,
  type RegistrationDraftPayload,
} from "../utils/registrationDraftStorage";
import { useDraftParticipants } from "./useDraftParticipants";
import { useDraftTeams } from "./useDraftTeams";

export function useRegistrationDraft(tournamentId: string) {
  const [hydrated, setHydrated] = useState(false);
  const [contactDetails, setContactDetails] = useState<CoachDetails | null>(
    null,
  );
  const draft = useDraftParticipants();
  const teamsDraft = useDraftTeams(draft);
  const skipNextSaveRef = useRef(true);

  useEffect(() => {
    if (!tournamentId) {
      return;
    }
    const stored = loadRegistrationDraft(tournamentId);
    if (stored) {
      draft.setParticipants(stored.participants);
      teamsDraft.replaceTeams(stored.teams);
      setContactDetails(stored.contactDetails);
    }
    skipNextSaveRef.current = true;
    setHydrated(true);
    // Hydrate once per tournament id
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional mount hydrate
  }, [tournamentId]);

  useEffect(() => {
    if (!hydrated || !tournamentId) {
      return;
    }
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }
    const existing = loadRegistrationDraft(tournamentId);
    saveRegistrationDraft(tournamentId, {
      mode: existing?.mode ?? null,
      contactDetails,
      participants: draft.participants,
      teams: teamsDraft.teams,
    });
  }, [
    hydrated,
    tournamentId,
    contactDetails,
    draft.participants,
    teamsDraft.teams,
  ]);

  const persistMode = useCallback(
    (mode: RegistrationDraftPayload["mode"]) => {
      if (!tournamentId) {
        return;
      }
      const current = loadRegistrationDraft(tournamentId);
      saveRegistrationDraft(tournamentId, {
        mode,
        contactDetails:
          contactDetails ?? current?.contactDetails ?? null,
        participants: draft.participants,
        teams: teamsDraft.teams,
      });
    },
    [tournamentId, contactDetails, draft.participants, teamsDraft.teams],
  );

  const clearStoredDraft = useCallback(() => {
    if (tournamentId) {
      clearRegistrationDraft(tournamentId);
    }
    skipNextSaveRef.current = true;
  }, [tournamentId]);

  const clearDraft = useCallback(() => {
    draft.setParticipants([]);
    teamsDraft.resetTeams();
    setContactDetails(null);
    clearStoredDraft();
  }, [draft, teamsDraft, clearStoredDraft]);

  const replaceParticipants = useCallback(
    (participants: DraftParticipant[]) => {
      draft.setParticipants(participants);
    },
    [draft],
  );

  const replaceTeams = useCallback(
    (teams: DraftTeam[]) => {
      teamsDraft.replaceTeams(teams);
    },
    [teamsDraft],
  );

  return {
    hydrated,
    contactDetails,
    setContactDetails,
    draft,
    teamsDraft,
    persistMode,
    clearDraft,
    clearStoredDraft,
    replaceParticipants,
    replaceTeams,
  };
}

export type UseRegistrationDraftReturn = ReturnType<typeof useRegistrationDraft>;
