import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import { CommonModels } from "@/data/common/common.models";

interface SubDisciplineSelectProps {
  label: string;
  value: CommonModels.SubDisciplineEnum | "" | null | undefined;
  onChange: (value: CommonModels.SubDisciplineEnum | null) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
}

export function SubDisciplineSelect({
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  fullWidth = true,
}: SubDisciplineSelectProps) {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const next = event.target.value;
    onChange(next === "" ? null : (next as CommonModels.SubDisciplineEnum));
  };

  return (
    <FormControl fullWidth={fullWidth} error={error} required={required}>
      <InputLabel>{label}</InputLabel>
      <Select value={value ?? ""} onChange={handleChange} label={label}>
        {!required && (
          <MenuItem value="">
            <em>{t("categories.create.noRestriction")}</em>
          </MenuItem>
        )}
        {Object.values(CommonModels.SubDisciplineEnum).map((subDiscipline) => (
          <MenuItem key={subDiscipline} value={subDiscipline}>
            {t(`subDiscipline.${subDiscipline}`)}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
