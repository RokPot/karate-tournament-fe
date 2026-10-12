import { useTranslation } from "react-i18next";

import Pill from "@/components/ui/Pill";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";

const PARTICIPANT_LINES = [
  { key: "oneCategory", labelKey: "tournaments.fees.oneCategory" },
  { key: "twoCategories", labelKey: "tournaments.fees.twoCategories" },
  {
    key: "threeOrMoreCategories",
    labelKey: "tournaments.fees.threeOrMoreCategories",
  },
] as const;

type TournamentFeeScheduleSummaryProps = {
  fees: CommonModels.TournamentFeeScheduleDto;
  variant?: "card" | "pills";
};

export const formatEuroAmount = (amount: number) =>
  `${amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} €`;

export const TournamentFeeScheduleSummary = ({
  fees,
  variant = "card",
}: TournamentFeeScheduleSummaryProps) => {
  const { t } = useTranslation();
  const lines = [
    ...PARTICIPANT_LINES.map(({ key, labelKey }) => ({
      key,
      label: t(labelKey),
      amount: fees[key],
    })),
    {
      key: "team",
      label: t("tournaments.fees.team"),
      amount: fees.team,
    },
  ];

  if (variant === "pills") {
    return (
      <div className="flex flex-row flex-wrap gap-1">
        {lines.map((line) => (
          <Pill key={line.key}>
            <Typography size="body-paragraph-s" className="text-neutral-200">
              {line.label}:
            </Typography>
            <Typography size="body-paragraph-s" className="font-weight-500">
              {formatEuroAmount(line.amount)}
            </Typography>
          </Pill>
        ))}
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-3 rounded-m border border-secondary-300 bg-secondary-200 p-5">
      <Typography size="h4">{t("tournaments.fees.title")}</Typography>
      <div className="flex flex-col gap-2">
        <Typography size="body-paragraph-s" variant="prominent-2" as="span">
          {t("tournaments.fees.participantTitle")}
        </Typography>
        {PARTICIPANT_LINES.map(({ key, labelKey }) => (
          <div
            key={key}
            className="flex items-center justify-between gap-3"
          >
            <Typography size="body-paragraph-s" as="span">
              {t(labelKey)}
            </Typography>
            <Typography size="body-paragraph-s" variant="prominent-2" as="span">
              {formatEuroAmount(fees[key])}
            </Typography>
          </div>
        ))}
      </div>
      <div className="border-t border-secondary-300" />
      <div className="flex flex-col gap-2">
        <Typography size="body-paragraph-s" variant="prominent-2" as="span">
          {t("tournaments.fees.teamTitle")}
        </Typography>
        <div className="flex items-center justify-between gap-3">
          <Typography size="body-paragraph-s" as="span">
            {t("tournaments.fees.team")}
          </Typography>
          <Typography size="body-paragraph-s" variant="prominent-2" as="span">
            {formatEuroAmount(fees.team)}
          </Typography>
        </div>
      </div>
    </section>
  );
};
