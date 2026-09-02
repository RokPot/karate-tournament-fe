import { ClubInvitationsSection } from "@/components/invitations/ClubInvitationsSection";
import { Typography } from "@/components/ui/text/Typography/Typography";
import ClubMembersSection from "@/pages/clubs/ClubMembersSection";
import { useTranslation } from "react-i18next";

interface ClubStaffDashboardProps {
  clubId: string;
}

export const ClubStaffDashboard = ({ clubId }: ClubStaffDashboardProps) => {
  const { t } = useTranslation();

  if (!clubId) {
    return (
      <div className="p-6">
        <Typography size="body-paragraph-m">{t("dashboard.noClub")}</Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <ClubMembersSection clubId={clubId} />
      <ClubInvitationsSection clubId={clubId} />
    </div>
  );
};
