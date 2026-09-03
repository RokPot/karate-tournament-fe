import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { TournamentsList } from "@/components/tournaments/TournamentsList";
import { RouteConfig } from "@/config/route.config";
import { AuthGuard } from "@/data/auth/AuthGuard";
import { TournamentsModels } from "@/data/tournaments/tournaments.models";
import { useAuthRoles } from "@/hooks/useAuthRoles";
import { useAuthUser } from "@/hooks/useAuthUser";

const TournamentsPage = () => {
  const { t } = useTranslation();
  const authUser = useAuthUser();
  const { isClubOwner, isClubCoach, isAdmin } = useAuthRoles();
  const [tab, setTab] = useState<Extract<TournamentsModels.TournamentsFindAllStatusParam, "approved" | "pending">>("approved");
  const canCreate = isAdmin || isClubOwner || isClubCoach;

  if (isAdmin) {
    return (
      <div className="mx-auto w-full max-w-7xl p-6">
        <Tabs
          value={tab}
          onChange={(_event, value: "approved" | "pending") => setTab(value)}
          className="mb-4"
        >
          <Tab value="approved" label={t("tournaments.tabs.active")} />
          <Tab value="pending" label={t("tournaments.tabs.pending")} />
        </Tabs>
        <TournamentsList
          showCreateButton={tab === "approved"}
          titleSize="h2"
          status={tab}
          showApprovalActions={tab === "pending"}
          showClubColumn={tab === "pending"}
        />
      </div>
    );
  }

  if (isClubOwner || isClubCoach) {
    return (
      <div className="mx-auto w-full max-w-7xl p-6">
        <TournamentsList
          showCreateButton={canCreate}
          titleSize="h2"
          source="club"
          clubId={authUser?.clubId ?? undefined}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <TournamentsList showCreateButton={canCreate} titleSize="h2" />
    </div>
  );
};

export default function Component() {
  return (
    <AuthGuard type="private" redirectTo={RouteConfig.signin}>
      <TournamentsPage />
    </AuthGuard>
  );
}
