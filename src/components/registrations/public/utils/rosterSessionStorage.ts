import type { CoachDetails } from "../types";

export type RosterAccessSession = {
  accessToken: string;
  expiresAt: string;
  updatedAt: string;
  email: string;
  clubName?: string;
  hydrated: boolean;
};

const storageKey = (tournamentId: string) =>
  `registration-roster:${tournamentId}`;

export function rosterIdentityKey(email: string, clubName?: string): string {
  return `${email.trim().toLowerCase()}\0${(clubName ?? "").trim().toLowerCase()}`;
}

export function isRosterSessionValid(
  session: RosterAccessSession,
  now = Date.now(),
): boolean {
  const expiresAt = Date.parse(session.expiresAt);
  return (
    session.accessToken.length >= 16 &&
    Number.isFinite(expiresAt) &&
    expiresAt > now
  );
}

export function loadRosterSession(
  tournamentId: string,
): RosterAccessSession | null {
  if (typeof window === "undefined" || !tournamentId) {
    return null;
  }
  try {
    const raw = sessionStorage.getItem(storageKey(tournamentId));
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<RosterAccessSession>;
    if (
      !parsed ||
      typeof parsed.accessToken !== "string" ||
      typeof parsed.expiresAt !== "string" ||
      typeof parsed.updatedAt !== "string" ||
      typeof parsed.email !== "string"
    ) {
      return null;
    }
    const session: RosterAccessSession = {
      accessToken: parsed.accessToken,
      expiresAt: parsed.expiresAt,
      updatedAt: parsed.updatedAt,
      email: parsed.email,
      clubName: parsed.clubName?.trim() || undefined,
      hydrated: parsed.hydrated === true,
    };
    if (!isRosterSessionValid(session)) {
      sessionStorage.removeItem(storageKey(tournamentId));
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveRosterSession(
  tournamentId: string,
  session: RosterAccessSession,
): void {
  if (typeof window === "undefined" || !tournamentId) {
    return;
  }
  try {
    sessionStorage.setItem(storageKey(tournamentId), JSON.stringify(session));
  } catch {
    // Quota / private mode — ignore
  }
}

export function clearRosterSession(tournamentId: string): void {
  if (typeof window === "undefined" || !tournamentId) {
    return;
  }
  try {
    sessionStorage.removeItem(storageKey(tournamentId));
  } catch {
    // ignore
  }
}

export function rosterIdentityFromCoach(
  tournamentId: string,
  coach: Pick<CoachDetails, "email" | "clubName">,
): { tournamentId: string; email: string; clubName?: string } {
  const clubName = coach.clubName?.trim();
  return {
    tournamentId,
    email: coach.email.trim(),
    ...(clubName ? { clubName } : {}),
  };
}
