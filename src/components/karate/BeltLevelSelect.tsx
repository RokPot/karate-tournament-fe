import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

import { CommonModels } from "@/data/common/common.models";
import { useTranslation } from "react-i18next";

interface BeltLevelSelectProps {
  label: string;
  value: CommonModels.BeltEnum | "" | null | undefined;
  onChange: (value: CommonModels.BeltEnum | null) => void;
  error?: boolean;
  helperText?: string;
  allowEmpty?: boolean;
  required?: boolean;
  fullWidth?: boolean;
}

export function BeltLevelSelect({
  label,
  value,
  onChange,
  error,
  helperText,
  allowEmpty = false,
  required = false,
  fullWidth = true,
}: BeltLevelSelectProps) {
  const { t } = useTranslation();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const next = event.target.value;
    onChange(next === "" ? null : (next as CommonModels.BeltEnum));
  };

  return (
    <FormControl fullWidth={fullWidth} error={error} required={required}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value ?? ""}
        onChange={handleChange}
        label={label}
      >
        {allowEmpty && (
          <MenuItem value="">
            <em>{t("categories.create.noRestriction")}</em>
          </MenuItem>
        )}
        {Object.values(CommonModels.BeltEnum).map((belt) => (
          <MenuItem key={belt} value={belt}>
            {t(`belt.${belt}`)}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
