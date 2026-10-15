import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { AppConfig } from "@/config/app.config";
import { useToast } from "@/components/ui/status/Toast/useToast";
import { CommonModels } from "@/data/common/common.models";
import { RegistrationsApi } from "@/data/registrations/registrations.api";
import { RegistrationsModels } from "@/data/registrations/registrations.models";
import { RegistrationsQueries } from "@/data/registrations/registrations.queries";
import { getHttpStatus } from "@/util/vendor/error-handling";

import type { CoachDetails, DraftParticipant, DraftTeam } from "../types";
import { hasUnsavedRegistrationDraft } from "../utils/hasUnsavedRegistrationDraft";
import { mapRosterToDraft, type MappedRosterDraft } from "../utils/mapRosterToDraft";
import { teamNameFormatterFromT } from "../utils/generateTeamNames";
import { mapToBulkDto } from "../utils/mapToBulkDto";
import {
  clearRosterSession,
  isRosterSessionValid,
  loadRosterSession,
  rosterIdentityFromCoach,
  rosterIdentityKey,
  saveRosterSession,
  type RosterAccessSession,
} from "../utils/rosterSessionStorage";

export type ContinuePhase = "idle" | "found" | "otp";

export type LookupRoute =
  | { type: "missing" }
  | { type: "resume" }
  | { type: "found" }
  | { type: "error" };

export type NewRegistrationRoute = {
  resume: boolean;
  resetDraft: boolean;
};

export type VerifyRoute = "applied" | "confirm" | "error";

export type SaveRoute =
  | { ok: true; roster: RegistrationsModels.RosterResponseDto }
  | { ok: false; reason: "expired" | "conflict" | "error" };

type UseContinueRegistrationOptions = {
  onCommit: (draft: MappedRosterDraft) => void;
};

export function useContinueRegistration(
  tournamentId: string,
  { onCommit }: UseContinueRegistrationOptions,
) {
  const { t } = useTranslation();
  const { errorToast } = useToast();
  const [phase, setPhase] = useState<ContinuePhase>("idle");
  const [session, setSession] = useState<RosterAccessSession | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [coach, setCoach] = useState<CoachDetails | null>(null);
  const [foundAt, setFoundAt] = useState<string | null>(null);
  const [debugCode, setDebugCode] = useState<string | undefined>();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [replacePrompt, setReplacePrompt] =
    useState<RegistrationsModels.RosterResponseDto | null>(null);
  const [conflictRoster, setConflictRoster] =
    useState<RegistrationsModels.RosterResponseDto | null>(null);
  const [loadingRoster, setLoadingRoster] = useState(false);

  const sessionRef = useRef(session);
  sessionRef.current = session;
  const coachRef = useRef(coach);
  coachRef.current = coach;
  const onCommitRef = useRef(onCommit);
  onCommitRef.current = onCommit;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const otpIdentityRef = useRef<string | null>(null);

  const lookupMutation = RegistrationsQueries.useLookupRoster();
  const otpMutation = RegistrationsQueries.useRequestRosterOtp();
  const verifyMutation = RegistrationsQueries.useVerifyRosterOtp();
  const putMutation = RegistrationsQueries.usePutCurrentRoster();

  useEffect(() => {
    const stored = loadRosterSession(tournamentId);
    setSession(stored);
    setSessionReady(true);
  }, [tournamentId]);

  const persistSession = useCallback(
    (next: RosterAccessSession) => {
      sessionRef.current = next;
      setSession(next);
      saveRosterSession(tournamentId, next);
    },
    [tournamentId],
  );

  const clearSession = useCallback(() => {
    sessionRef.current = null;
    setSession(null);
    clearRosterSession(tournamentId);
    setReplacePrompt(null);
    setConflictRoster(null);
    setDebugCode(undefined);
  }, [tournamentId]);

  const commitRoster = useCallback(
    (roster: RegistrationsModels.RosterResponseDto) => {
      onCommitRef.current(mapRosterToDraft(roster));
      const prev = sessionRef.current;
      if (!prev?.accessToken) {
        return;
      }
      persistSession({
        ...prev,
        updatedAt: roster.updatedAt,
        email: roster.email,
        clubName: roster.clubName?.trim() || undefined,
        hydrated: true,
      });
    },
    [persistSession],
  );

  const stageRoster = useCallback(
    (
      roster: RegistrationsModels.RosterResponseDto,
      options?: { force?: boolean },
    ): "applied" | "confirm" => {
      const current = sessionRef.current;
      const incomingKey = rosterIdentityKey(
        roster.email,
        roster.clubName ?? undefined,
      );
      const sameWorkingCopy =
        !!current?.hydrated &&
        rosterIdentityKey(current.email, current.clubName) === incomingKey;
      if (
        !options?.force &&
        !sameWorkingCopy &&
        hasUnsavedRegistrationDraft(tournamentId)
      ) {
        setReplacePrompt(roster);
        return "confirm";
      }
      setReplacePrompt(null);
      commitRoster(roster);
      return "applied";
    },
    [commitRoster, tournamentId],
  );

  const requestOtp = useCallback(
    async (details: CoachDetails, options?: { keepMessage?: boolean }) => {
      setCoach(details);
      coachRef.current = details;
      otpIdentityRef.current = rosterIdentityKey(details.email, details.clubName);
      setDebugCode(undefined);
      if (!options?.keepMessage) {
        setStatusMessage(null);
      }
      try {
        const response = await otpMutation.mutateAsync({
          data: rosterIdentityFromCoach(tournamentId, details),
        });
        const code =
          !AppConfig.isProduction && response?.debugCode
            ? response.debugCode
            : undefined;
        setDebugCode(code);
        setPhase("otp");
        return true;
      } catch (error) {
        if (getHttpStatus(error) === 429) {
          setStatusMessage(t("registrations.public.continue.rateLimit"));
          setPhase("otp");
          return false;
        }
        errorToast({
          text:
            error instanceof Error
              ? error.message
              : t("registrations.public.submitError"),
        });
        return false;
      }
    },
    [errorToast, otpMutation, t, tournamentId],
  );

  const expireToOtp = useCallback(
    async (details: CoachDetails | null) => {
      clearSession();
      setPhase("otp");
      if (!details) {
        setStatusMessage(t("registrations.public.continue.sessionExpired"));
        return;
      }
      const sent = await requestOtp(details);
      if (sent) {
        setStatusMessage(t("registrations.public.continue.sessionExpired"));
      }
    },
    [clearSession, requestOtp, t],
  );

  const lookup = useCallback(
    async (details: CoachDetails): Promise<LookupRoute> => {
      setCoach(details);
      coachRef.current = details;
      setStatusMessage(null);
      setDebugCode(undefined);
      setReplacePrompt(null);
      try {
        const result = await lookupMutation.mutateAsync({
          data: rosterIdentityFromCoach(tournamentId, details),
        });
        const key = rosterIdentityKey(details.email, details.clubName);
        const current = sessionRef.current;
        const sameSession =
          !!current &&
          isRosterSessionValid(current) &&
          rosterIdentityKey(current.email, current.clubName) === key;

        if (!result.found) {
          otpIdentityRef.current = null;
          setFoundAt(null);
          setPhase("idle");
          setStatusMessage(t("registrations.public.continue.notFound"));
          return { type: "missing" };
        }

        setFoundAt(result.updatedAt ?? "");
        if (sameSession && current?.hydrated) {
          setPhase("idle");
          return { type: "resume" };
        }
        const stayOnOtp =
          phaseRef.current === "otp" && otpIdentityRef.current === key;
        if (!stayOnOtp) {
          setPhase("found");
        }
        return { type: "found" };
      } catch (error) {
        errorToast({
          text:
            error instanceof Error
              ? error.message
              : t("registrations.public.submitError"),
        });
        return { type: "error" };
      }
    },
    [errorToast, lookupMutation, t, tournamentId],
  );

  const beginContinue = useCallback(async () => {
    const details = coachRef.current;
    if (!details) {
      return;
    }
    await requestOtp(details);
  }, [requestOtp]);

  const checkExisting = useCallback(
    async (
      details: CoachDetails,
    ): Promise<LookupRoute> => {
      const route = await lookup(details);
      if (route.type === "found") {
        await requestOtp(details);
      }
      return route;
    },
    [lookup, requestOtp],
  );

  const beginNewRegistration = useCallback(
    (details: CoachDetails): NewRegistrationRoute => {
      const current = sessionRef.current;
      const sameHydratedSession =
        !!current?.hydrated &&
        isRosterSessionValid(current) &&
        rosterIdentityKey(current.email, current.clubName) ===
          rosterIdentityKey(details.email, details.clubName);
      if (sameHydratedSession) {
        return { resume: true, resetDraft: false };
      }
      const resetDraft = !!current?.hydrated;
      if (current) {
        clearSession();
      }
      otpIdentityRef.current = null;
      setPhase("idle");
      setFoundAt(null);
      setStatusMessage(null);
      return { resume: false, resetDraft };
    },
    [clearSession],
  );

  const verifyCode = useCallback(
    async (code: string): Promise<VerifyRoute> => {
      const details = coachRef.current;
      if (!details) {
        return "error";
      }
      setStatusMessage(null);
      try {
        const verified = await verifyMutation.mutateAsync({
          data: {
            ...rosterIdentityFromCoach(tournamentId, details),
            code,
          },
        });
        const nextSession: RosterAccessSession = {
          accessToken: verified.accessToken,
          expiresAt: verified.expiresAt,
          updatedAt: verified.updatedAt,
          email: details.email.trim(),
          clubName: details.clubName?.trim() || undefined,
          hydrated: false,
        };
        persistSession(nextSession);
        setLoadingRoster(true);
        const roster = await RegistrationsApi.getCurrentRoster(
          verified.accessToken,
        );
        persistSession({
          ...nextSession,
          updatedAt: roster.updatedAt,
          email: roster.email,
          clubName: roster.clubName?.trim() || undefined,
        });
        const staged = stageRoster(roster);
        if (staged === "applied") {
          setPhase("idle");
        }
        return staged;
      } catch (error) {
        const status = getHttpStatus(error);
        if (status === 401) {
          await expireToOtp(details);
          return "error";
        }
        if (status === 400) {
          setStatusMessage(t("registrations.public.continue.invalidCode"));
          return "error";
        }
        const message =
          error instanceof Error
            ? error.message
            : t("registrations.public.submitError");
        setStatusMessage(message);
        errorToast({ text: message });
        return "error";
      } finally {
        setLoadingRoster(false);
      }
    },
    [
      errorToast,
      expireToOtp,
      persistSession,
      stageRoster,
      t,
      tournamentId,
      verifyMutation,
    ],
  );

  const confirmReplace = useCallback(() => {
    if (!replacePrompt) {
      return false;
    }
    commitRoster(replacePrompt);
    setReplacePrompt(null);
    setPhase("idle");
    return true;
  }, [commitRoster, replacePrompt]);

  const cancelReplace = useCallback(() => {
    setReplacePrompt(null);
    setPhase("found");
  }, []);

  const acceptConflict = useCallback(() => {
    if (!conflictRoster) {
      return;
    }
    commitRoster(conflictRoster);
    setConflictRoster(null);
  }, [commitRoster, conflictRoster]);

  const save = useCallback(
    async (args: {
      coach: CoachDetails;
      participants: DraftParticipant[];
      teams: DraftTeam[];
      categories: CommonModels.CategoryResponseDto[];
    }): Promise<SaveRoute> => {
      const current = sessionRef.current;
      if (!current?.hydrated) {
        return { ok: false, reason: "error" };
      }
      const payload: RegistrationsModels.RosterPutDto = {
        ...mapToBulkDto(
          tournamentId,
          args.coach,
          args.participants,
          args.teams,
          args.categories,
          teamNameFormatterFromT(t),
        ),
        accessToken: current.accessToken,
        updatedAt: current.updatedAt,
      };
      try {
        const updated = await putMutation.mutateAsync({ data: payload });
        commitRoster(updated);
        return { ok: true, roster: updated };
      } catch (error) {
        const status = getHttpStatus(error);
        if (status === 401) {
          await expireToOtp(args.coach);
          return { ok: false, reason: "expired" };
        }
        if (status === 409) {
          try {
            setLoadingRoster(true);
            const fresh = await RegistrationsApi.getCurrentRoster(
              current.accessToken,
            );
            setConflictRoster(fresh);
            return { ok: false, reason: "conflict" };
          } catch (reloadError) {
            if (getHttpStatus(reloadError) === 401) {
              await expireToOtp(args.coach);
              return { ok: false, reason: "expired" };
            }
            errorToast({
              text:
                reloadError instanceof Error
                  ? reloadError.message
                  : t("registrations.public.submitError"),
            });
            return { ok: false, reason: "error" };
          } finally {
            setLoadingRoster(false);
          }
        }
        errorToast({
          text:
            error instanceof Error
              ? error.message
              : t("registrations.public.submitError"),
        });
        return { ok: false, reason: "error" };
      }
    },
    [commitRoster, errorToast, expireToOtp, putMutation, t, tournamentId],
  );

  const showForm = useCallback(() => {
    otpIdentityRef.current = null;
    setPhase("idle");
    setStatusMessage(null);
    setDebugCode(undefined);
    setReplacePrompt(null);
  }, []);

  const startEdit = useCallback(
    async (details: CoachDetails) => {
      setFoundAt(null);
      setPhase("otp");
      await requestOtp(details);
    },
    [requestOtp],
  );

  const resetContinue = useCallback(() => {
    clearSession();
    setPhase("idle");
    setCoach(null);
    setFoundAt(null);
    setStatusMessage(null);
  }, [clearSession]);

  const isBusy =
    lookupMutation.isPending ||
    otpMutation.isPending ||
    verifyMutation.isPending ||
    putMutation.isPending ||
    loadingRoster;

  const isContinuing = session?.hydrated === true;
  const blocksClubSeed =
    !sessionReady || phase !== "idle" || isContinuing || loadingRoster;

  return {
    phase,
    coach,
    foundAt,
    debugCode,
    statusMessage,
    replacePrompt,
    conflictRoster,
    isBusy,
    isContinuing,
    blocksClubSeed,
    lookup,
    checkExisting,
    beginNewRegistration,
    beginContinue,
    verifyCode,
    confirmReplace,
    cancelReplace,
    acceptConflict,
    save,
    showForm,
    startEdit,
    resetContinue,
  };
}
