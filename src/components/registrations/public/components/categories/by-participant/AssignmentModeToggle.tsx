import { CategoryAssignmentMode } from "@/components/registrations/public/components/categories/by-participant/ParticipantAssignmentStep";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";


interface AssignmentModeToggleProps {
  value: CategoryAssignmentMode;
  onChange: (mode: CategoryAssignmentMode) => void;
}

export function AssignmentModeToggle({
  value,
  onChange,
}: AssignmentModeToggleProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2" role="group">
      <Button
        size="small"
        variant={value === "category" ? "contained" : "outlined"}
        aria-pressed={value === "category"}
        onClick={() => onChange("category")}
      >
        {t("registrations.public.assignmentMode.category")}
      </Button>
      <Button
        size="small"
        variant={value === "athlete" ? "contained" : "outlined"}
        aria-pressed={value === "athlete"}
        onClick={() => onChange("athlete")}
      >
        {t("registrations.public.assignmentMode.athlete")}
      </Button>
    </div>
  );
}
