import clsx from "clsx";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { ArrowDropUpIcon } from "@/assets/icons/general/ArrowDropUp";
import { useCategoryFormatters } from "@/components/categories/category-formatters";
import { ErrorState } from "@/components/shared/layout/ErrorState";
import { uiOutlineClass } from "@/components/ui/global/outline";
import Pill from "@/components/ui/Pill";
import { Loader } from "@/components/ui/status/Loader/Loader";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";
import { RegistrationsModels } from "@/data/registrations/registrations.models";
import { RegistrationsQueries } from "@/data/registrations/registrations.queries";
import { DateUtils } from "@/util/date.utils";

interface IProps {
  category: CommonModels.CategoryResponseDto;
  tournamentId: string;
  registrationCount: number;
}

export const CategoryRegistrationsAccordionItem = ({
  category,
  tournamentId,
  registrationCount,
}: IProps) => {
  const { t } = useTranslation();
  const {
    emptyLabel,
    formatAgeRange,
    formatBeltRange,
    formatTeamSize,
    formatWeightRange,
  } = useCategoryFormatters();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data, isLoading, error, refetch } =
    RegistrationsQueries.useFindByTournament(
      { tournamentId, categoryId: category.id },
      { enabled: isExpanded && !!tournamentId },
    );

  const metadataPills = useMemo(() => {
    const age = formatAgeRange(category);
    const weight = formatWeightRange(category);
    const belt = formatBeltRange(category);
    const teamSize = formatTeamSize(category);

    const pills = [
      t(`discipline.${category.discipline}`),
      category.subDiscipline
        ? t(`subDiscipline.${category.subDiscipline}`)
        : null,
      category.gender ? t(`categories.create.${category.gender}`) : null,
      age !== emptyLabel ? age : null,
      weight !== emptyLabel ? weight : null,
      belt !== emptyLabel ? belt : null,
      teamSize !== emptyLabel ? teamSize : null,
    ];

    return pills.filter((label): label is string => Boolean(label));
  }, [
    category,
    emptyLabel,
    formatAgeRange,
    formatBeltRange,
    formatTeamSize,
    formatWeightRange,
    t,
  ]);

  return (
    <div className="border-b border-primary-100 last:border-b-0">
      <button
        type="button"
        className={clsx(
          "flex w-full items-center gap-3 bg-primary-50 px-4 py-3 text-left hover:bg-secondary-50 cursor-pointer transition duration-300",
          uiOutlineClass,
          isExpanded && "border-b border-primary-300",
        )}
        aria-expanded={isExpanded}
        aria-label={t(
          isExpanded
            ? "registrations.collapseCategory"
            : "registrations.expandCategory",
          { name: category.name },
        )}
        onClick={() => setIsExpanded((open) => !open)}
      >
        <ArrowDropUpIcon
          className={clsx(
            "h-6 w-6 shrink-0 text-tertiary-300 transition-transform duration-200",
            isExpanded ? "rotate-0" : "rotate-180",
          )}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Typography size="body-paragraph-m" variant="prominent-2" as="span">
            {category.name}
          </Typography>
          {metadataPills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {metadataPills.map((label) => (
                <Pill key={label}>
                  <Typography size="body-paragraph-s" as="span">
                    {label}
                  </Typography>
                </Pill>
              ))}
            </div>
          )}
        </div>
        <Pill>
          <Typography
            size="body-paragraph-s"
            className="font-weight-500 text-tertiary-300"
            as="span"
          >
            {t("registrations.registeredCount", { count: registrationCount })}
          </Typography>
        </Pill>
      </button>
      {isExpanded && (
        <div className="bg-primary-200 p-0">
          <AccordionRegistrationsPanel
            isLoading={isLoading}
            error={error}
            onRetry={() => refetch()}
            registrations={data ?? []}
          />
        </div>
      )}
    </div>
  );
};

const AccordionRegistrationsPanel = ({
  isLoading,
  error,
  onRetry,
  registrations,
}: {
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  registrations: RegistrationsModels.RegistrationResponseDto[];
}) => {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="flex justify-center py-6 ">
        <Loader size="m" />
      </div>
    );
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (registrations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-6">
        <Typography size="body-paragraph-m">
          {t("registrations.noAttendees")}
        </Typography>
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {registrations.map((registration) => (
        <RegistrationRow key={registration.id} registration={registration} />
      ))}
    </ul>
  );
};

const RegistrationRow = ({
  registration,
}: {
  registration: RegistrationsModels.RegistrationResponseDto;
}) => {
  const { t } = useTranslation();
  const { user, club, teamRole } = registration;
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "—";
  const details = [
    club?.name,
    user?.gender ? t(`categories.create.${user.gender}`) : null,
    user?.dateOfBirth
      ? DateUtils.formatAgeFromBirthDate(user.dateOfBirth)
      : null,
    user?.weight ? `${user.weight} kg` : null,
    user?.beltLevel ? t(`belt.${user.beltLevel}`) : null,
    teamRole ? t(`registrations.public.teams.roles.${teamRole}`) : null,
  ].filter((label): label is string => Boolean(label) && label !== "-");

  return (
    <li className="flex flex-col gap-1 border-b border-primary-100 px-4 py-3 last:border-b-0">
      <Typography size="body-paragraph-m" variant="prominent-2">
        {name}
      </Typography>
      {details.length > 0 && (
        <Typography size="body-paragraph-s" className="text-secondary-200">
          {details.join(" · ")}
        </Typography>
      )}
    </li>
  );
};
