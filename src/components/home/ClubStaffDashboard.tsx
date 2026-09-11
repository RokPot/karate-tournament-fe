import {
  DashboardPanel,
  DashboardStatCard,
} from "@/components/home/DashboardPanel";
import { ClubInvitationsSection } from "@/components/invitations/ClubInvitationsSection";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { ClubsQueries } from "@/data/clubs/clubs.queries";
import { InvitationsQueries } from "@/data/invitations/invitations.queries";
import ClubMembersSection from "@/pages/clubs/ClubMembersSection";
import { useTranslation } from "react-i18next";

interface ClubStaffDashboardProps {
  clubId: string;
}

export const ClubStaffDashboard = ({ clubId }: ClubStaffDashboardProps) => {
  const { t } = useTranslation();
  const { data: members } = ClubsQueries.useGetMembers(
    { id: clubId },
    { enabled: !!clubId },
  );
  const { data: invitations } = InvitationsQueries.useFindAll(
    { clubId },
    { enabled: !!clubId },
  );

  if (!clubId) {
    return (
      <div className="bg-secondary-75 p-6">
        <Typography size="body-paragraph-m">{t("dashboard.noClub")}</Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 bg-secondary-75 p-6">
      <div className="grid grid-cols-1 gap-4 t:grid-cols-2">
        <DashboardStatCard
          label={t("dashboard.stats.members")}
          value={members?.length ?? 0}
        />
        <DashboardStatCard
          label={t("dashboard.stats.invitations")}
          value={invitations?.length ?? 0}
        />
      </div>
      <div className="flex flex-col gap-6">
        <DashboardPanel>
          <ClubMembersSection clubId={clubId} />
        </DashboardPanel>
        <DashboardPanel>
          <ClubInvitationsSection clubId={clubId} />
        </DashboardPanel>
      </div>
    </div>
  );
};
