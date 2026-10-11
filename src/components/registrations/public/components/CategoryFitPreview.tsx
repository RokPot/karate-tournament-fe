import {
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";
import { TournamentsModels } from "@/data/tournaments/tournaments.models";
import { DateUtils } from "@/util/date.utils";

import { filterCategoriesByPreview } from "../utils/filterCategoriesByPreview";

type CategoryFitPreviewProps = {
  tournament: TournamentsModels.TournamentPublicLiteResponseDto;
};

const formatGenderLabel = (value: string) =>
  value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export function CategoryFitPreview({ tournament }: CategoryFitPreviewProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<
    CommonModels.CategoryGenderEnum | ""
  >("");
  const [weight, setWeight] = useState("");

  const matches = useMemo(() => {
    if (!dateOfBirth || !gender) return null;
    const parsedDob = DateUtils.parseDate(dateOfBirth);
    if (!parsedDob) return [];
    const weightKg = weight.trim() === "" ? undefined : Number(weight);
    return filterCategoriesByPreview(tournament.categories, {
      dateOfBirth: parsedDob.toISOString(),
      gender,
      weightKg:
        weightKg != null && Number.isFinite(weightKg) ? weightKg : undefined,
      competitionDate: tournament.startDate,
    });
  }, [dateOfBirth, gender, tournament.categories, tournament.startDate, weight]);

  return (
    <div className="overflow-hidden rounded-m border border-secondary-300 bg-secondary-200">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <Typography size="body-paragraph-m" variant="prominent-1">
          {t("registrations.public.intro.categoryCheckTitle")}
        </Typography>
        <span className="text-primary-300 text-xl leading-none" aria-hidden>
          {open ? "−" : "+"}
        </span>
      </button>

      {open && (
        <div className="flex flex-col gap-4 border-t border-secondary-300 px-5 py-4">
          <Typography size="body-paragraph-s" className="text-neutral-200">
            {t("registrations.public.intro.categoryCheckHint")}
          </Typography>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <TextField
              label={t("registrations.public.intro.dateOfBirth")}
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>{t("shared.gender")}</InputLabel>
              <Select
                value={gender}
                label={t("shared.gender")}
                onChange={(e) =>
                  setGender(e.target.value as CommonModels.CategoryGenderEnum)
                }
              >
                {Object.values(CommonModels.CategoryGenderEnum).map((g) => (
                  <MenuItem key={g} value={g}>
                    {formatGenderLabel(g)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label={t("registrations.public.intro.weightOptional")}
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              inputProps={{ min: 0, step: 0.1 }}
            />
          </div>

          {!dateOfBirth || !gender ? (
            <Typography size="body-paragraph-s" className="text-neutral-200">
              {t("registrations.public.intro.categoryCheckEmpty")}
            </Typography>
          ) : matches && matches.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {matches.map((category) => (
                <li key={category.id}>
                  <Typography size="body-paragraph-s">
                    {category.name}
                  </Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography size="body-paragraph-s" className="text-neutral-200">
              {t("registrations.public.intro.categoryCheckNone")}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
}
