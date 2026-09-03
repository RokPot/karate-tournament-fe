import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { CategoryRegistrationsAccordionItem } from "@/components/tournaments/CategoryRegistrationsAccordionItem";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";
import { RegistrationsQueries } from "@/data/registrations/registrations.queries";

interface IProps {
  categories: CommonModels.CategoryResponseDto[];
  tournamentId: string;
}

export const CategoryRegistrationsAccordion = ({
  categories,
  tournamentId,
}: IProps) => {
  const { t } = useTranslation();
  const { data: counts } = RegistrationsQueries.useFindCountsByTournament(
    { tournamentId },
    { enabled: !!tournamentId },
  );

  const countsByCategoryId = useMemo(() => {
    return new Map(
      (counts ?? []).map((item) => [item.categoryId, item.registrationCount]),
    );
  }, [counts]);

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-10">
        <Typography size="body-paragraph-lg">
          {t("registrations.noAttendees")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xs border border-primary-300 bg-primary-200">
      {categories.map((category) => (
        <CategoryRegistrationsAccordionItem
          key={category.id}
          category={category}
          tournamentId={tournamentId}
          registrationCount={countsByCategoryId.get(category.id) ?? 0}
        />
      ))}
    </div>
  );
};
