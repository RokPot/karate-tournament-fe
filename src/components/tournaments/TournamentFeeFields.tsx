import { TextField } from "@mui/material";
import { FieldErrors, Path, UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";

const PARTICIPANT_FEE_FIELDS = [
  { name: "oneCategory", labelKey: "tournaments.fees.oneCategory" },
  { name: "twoCategories", labelKey: "tournaments.fees.twoCategories" },
  {
    name: "threeOrMoreCategories",
    labelKey: "tournaments.fees.threeOrMoreCategories",
  },
] as const;

type FeeFieldName = keyof CommonModels.TournamentFeeScheduleDto;

type FeesFormValues = {
  fees: CommonModels.TournamentFeeScheduleDto;
};

type TournamentFeeFieldsProps<TFieldValues extends FeesFormValues> = {
  register: UseFormRegister<TFieldValues>;
  errors?: FieldErrors<TFieldValues>;
};

export const TournamentFeeFields = <TFieldValues extends FeesFormValues>({
  register,
  errors,
}: TournamentFeeFieldsProps<TFieldValues>) => {
  const { t } = useTranslation();
  const feeErrors = errors?.fees as
    | FieldErrors<CommonModels.TournamentFeeScheduleDto>
    | undefined;

  const renderField = (name: FeeFieldName, labelKey: string) => (
    <TextField
      label={t(labelKey as any)}
      type="number"
      {...register(`fees.${name}` as Path<TFieldValues>, {
        setValueAs: (value) =>
          value === "" || value === undefined ? 0 : Number(value),
      })}
      error={!!feeErrors?.[name]}
      helperText={feeErrors?.[name]?.message}
      fullWidth
      required
      inputProps={{ min: 0, step: 0.01 }}
      InputLabelProps={{ shrink: true }}
    />
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Typography size="body-paragraph-m" variant="prominent-1" as="span">
          {t("tournaments.fees.participantTitle")}
        </Typography>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {PARTICIPANT_FEE_FIELDS.map(({ name, labelKey }) => (
            <div key={name}>{renderField(name, labelKey)}</div>
          ))}
        </div>
      </div>

      <div className="border-t border-secondary-300" />

      <div className="flex flex-col gap-3">
        <Typography size="body-paragraph-m" variant="prominent-1" as="span">
          {t("tournaments.fees.teamTitle")}
        </Typography>
        {renderField("team", "tournaments.fees.team")}
      </div>
    </div>
  );
};
