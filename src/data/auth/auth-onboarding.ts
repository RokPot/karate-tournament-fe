export const PENDING_INVITE_TOKEN_KEY = "pending_invite_token";
export const PENDING_PROFILE_SETUP_KEY = "pending_profile_setup";

export function markPendingProfileSetup() {
  localStorage.setItem(PENDING_PROFILE_SETUP_KEY, "true");
}

export function clearPendingProfileSetup() {
  localStorage.removeItem(PENDING_PROFILE_SETUP_KEY);
}

export function hasPendingProfileSetup() {
  return localStorage.getItem(PENDING_PROFILE_SETUP_KEY) === "true";
}

export function getPendingInviteToken() {
  return localStorage.getItem(PENDING_INVITE_TOKEN_KEY);
}

export function setPendingInviteToken(token: string) {
  localStorage.setItem(PENDING_INVITE_TOKEN_KEY, token);
}

export function clearPendingInviteToken() {
  localStorage.removeItem(PENDING_INVITE_TOKEN_KEY);
}
