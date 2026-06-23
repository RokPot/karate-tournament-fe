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

interface DisciplineSelectProps {
  label: string;
  value: CommonModels.DisciplineEnum | "" | null | undefined;
  onChange: (value: CommonModels.DisciplineEnum) => void;
  error?: boolean;
  helperText?: string;
  required?: boolean;
  fullWidth?: boolean;
}

export function DisciplineSelect({
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  fullWidth = true,
}: DisciplineSelectProps) {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value as CommonModels.DisciplineEnum);
  };

  return (
    <FormControl fullWidth={fullWidth} error={error} required={required}>
      <InputLabel>{label}</InputLabel>
      <Select value={value ?? ""} onChange={handleChange} label={label}>
        {Object.values(CommonModels.DisciplineEnum).map((discipline) => (
          <MenuItem key={discipline} value={discipline}>
            {t(`discipline.${discipline}`)}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
