import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { CategoryRegistrationsAccordionItem } from "@/components/tournaments/CategoryRegistrationsAccordionItem";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";
import { RegistrationsQueries } from "@/data/registrations/registrations.queries";

interface IProps {
  categories: CommonModels.CategoryResponseDto[];
  tournamentId: string;
  clubId?: string;
  canEdit?: boolean;
  query: string;
}

const categoryHaystack = (
  category: CommonModels.CategoryResponseDto,
  labels: {
    discipline: string;
    subDiscipline: string;
    gender: string;
  },
) =>
  [category.name, labels.discipline, labels.subDiscipline, labels.gender]
    .join(" ")
    .toLowerCase();

export const CategoryRegistrationsAccordion = ({
  categories,
  tournamentId,
  clubId,
  canEdit = false,
  query,
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

  const needle = query.trim().toLowerCase();
  const visibleCategories = useMemo(() => {
    if (!needle) {
      return categories;
    }
    return categories.filter((category) =>
      categoryHaystack(category, {
        discipline: t(`discipline.${category.discipline}`),
        subDiscipline: category.subDiscipline
          ? t(`subDiscipline.${category.subDiscipline}`)
          : "",
        gender: category.gender
          ? t(`categories.create.${category.gender}`)
          : "",
      }).includes(needle),
    );
  }, [categories, needle, t]);

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-10">
        <Typography size="body-paragraph-lg">
          {t("registrations.noAttendees")}
        </Typography>
      </div>
    );
  }

  if (visibleCategories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-10">
        <Typography size="body-paragraph-lg">
          {t("registrations.search.noMatches")}
        </Typography>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xs border border-secondary-300 bg-secondary-200">
      {visibleCategories.map((category) => (
        <CategoryRegistrationsAccordionItem
          key={category.id}
          category={category}
          tournamentId={tournamentId}
          clubId={clubId}
          registrationCount={countsByCategoryId.get(category.id) ?? 0}
          canEdit={canEdit}
        />
      ))}
    </div>
  );
};
