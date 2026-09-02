import { useEffect, useState } from "react";

import { CompleteProfileModal } from "@/components/profile/CompleteProfileModal";
import { useInviteAcceptStatus } from "@/components/invitations/InviteAcceptHandler";
import { AuthContext } from "@/data/auth/auth.context";
import { hasPendingProfileSetup } from "@/data/auth/auth-onboarding";

export const CompleteProfilePrompt = () => {
  const { user, isLoggedIn } = AuthContext.useAuth();
  const { isAccepting } = useInviteAcceptStatus();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !user || isAccepting) {
      return;
    }

    const namesMissing = !user.firstName?.trim() || !user.lastName?.trim();
    if (hasPendingProfileSetup() || namesMissing) {
      setOpen(true);
    }
  }, [isLoggedIn, user, isAccepting]);

  if (!user) {
    return null;
  }

  return (
    <CompleteProfileModal
      open={open}
      user={user}
      disableDismiss
      onClose={() => setOpen(false)}
    />
  );
};
