import { Button } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import Pill from "@/components/ui/Pill";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { TournamentsModels } from "@/data/tournaments/tournaments.models";

import { TournamentCategoriesModal } from "./TournamentCategoriesModal";

interface RegistrationPageHeaderProps {
  tournament: TournamentsModels.TournamentPublicLiteResponseDto;
}

export function RegistrationPageHeader({
  tournament,
}: RegistrationPageHeaderProps) {
  const { t } = useTranslation();
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-3 border-b border-primary-300 bg-primary-75 px-6 py-5 md:px-10 lg:px-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <Typography size="h2">{tournament.name}</Typography>
            <Typography size="body-paragraph-m" className="text-secondary-200">
              {t("registrations.public.pageTitle")}
            </Typography>
          </div>
          <Button
            variant="outlined"
            onClick={() => setCategoriesModalOpen(true)}
            className="shrink-0 self-end sm:self-start"
          >
            {t("registrations.public.showCategories")}
          </Button>
        </div>
        <div className="flex flex-row flex-wrap gap-2">
          <Pill>
            <Typography size="body-paragraph-s" className="text-secondary-200">
              {t("shared.location")}:
            </Typography>
            <Typography size="body-paragraph-s" className="font-weight-500">
              {tournament.location}
            </Typography>
          </Pill>
          <Pill>
            <Typography size="body-paragraph-s" className="font-weight-500">
              {new Date(tournament.startDate).toLocaleDateString()}
            </Typography>
          </Pill>
          <Pill>
            <Typography size="body-paragraph-s" className="text-secondary-200">
              {t("shared.registrationDeadline")}:
            </Typography>
            <Typography size="body-paragraph-s" className="font-weight-500">
              {new Date(tournament.registrationDeadline).toLocaleDateString()}
            </Typography>
          </Pill>
        </div>
      </div>

      <TournamentCategoriesModal
        open={categoriesModalOpen}
        onClose={() => setCategoriesModalOpen(false)}
        categories={tournament.categories}
      />
    </>
  );
}
