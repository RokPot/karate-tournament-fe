import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CategoryRegistrationsAccordion } from "@/components/tournaments/CategoryRegistrationsAccordion";
import { ParticipantRegistrationsList } from "@/components/tournaments/registrations/ParticipantRegistrationsList";
import { RegistrationSubmissionsList } from "@/components/tournaments/registrations/RegistrationSubmissionsList";
import { CommonModels } from "@/data/common/common.models";

type RegistrationsView = "submissions" | "category" | "participants";

type TournamentRegistrationsPanelProps = {
  tournamentId: string;
  categories: CommonModels.CategoryResponseDto[];
  clubId?: string;
  canEditRegistrations: boolean;
};

export const TournamentRegistrationsPanel = ({
  tournamentId,
  categories,
  clubId,
  canEditRegistrations,
}: TournamentRegistrationsPanelProps) => {
  const { t } = useTranslation();
  const [view, setView] = useState<RegistrationsView>("submissions");

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={view}
        onChange={(_event, value: RegistrationsView) => setView(value)}
        aria-label={t("registrations.views.label")}
      >
        <Tab
          value="submissions"
          label={t("registrations.views.submissions")}
        />
        <Tab value="category" label={t("registrations.views.category")} />
        <Tab
          value="participants"
          label={t("registrations.views.participants")}
        />
      </Tabs>

      {view === "submissions" && (
        <RegistrationSubmissionsList tournamentId={tournamentId} />
      )}
      {view === "category" && (
        <CategoryRegistrationsAccordion
          categories={categories}
          tournamentId={tournamentId}
          clubId={clubId}
          canEdit={canEditRegistrations}
        />
      )}
      {view === "participants" && (
        <ParticipantRegistrationsList
          tournamentId={tournamentId}
          categories={categories}
          clubId={clubId}
          canEdit={canEditRegistrations}
        />
      )}
    </div>
  );
};
