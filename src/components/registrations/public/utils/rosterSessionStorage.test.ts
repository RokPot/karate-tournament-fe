import {
  isRosterSessionValid,
  rosterIdentityKey,
  type RosterAccessSession,
} from "./rosterSessionStorage";

const session = (
  overrides: Partial<RosterAccessSession> = {},
): RosterAccessSession => ({
  accessToken: "a".repeat(16),
  expiresAt: "2026-04-15T12:00:00.000Z",
  updatedAt: "2026-04-15T10:00:00.000Z",
  email: "Coach@Club.com",
  clubName: "SKIF Ljubljana",
  hydrated: true,
  ...overrides,
});

describe("roster session helpers", () => {
  it("matches identity on email and club only", () => {
    expect(rosterIdentityKey("Coach@Club.com", "SKIF Ljubljana")).toBe(
      rosterIdentityKey("coach@club.com", " skif ljubljana "),
    );
    expect(rosterIdentityKey("coach@club.com", undefined)).not.toBe(
      rosterIdentityKey("coach@club.com", "SKIF"),
    );
  });

  it("treats a token as valid until expiresAt", () => {
    const now = Date.parse("2026-04-15T11:00:00.000Z");
    expect(isRosterSessionValid(session(), now)).toBe(true);
    expect(
      isRosterSessionValid(
        session({ expiresAt: "2026-04-15T11:00:00.000Z" }),
        now,
      ),
    ).toBe(false);
    expect(
      isRosterSessionValid(session({ accessToken: "short" }), now),
    ).toBe(false);
  });
});
