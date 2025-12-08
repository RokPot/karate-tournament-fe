import { Typography } from "@/components/ui/text/Typography/Typography";
import { DateUtils } from "@/util/date.utils";

export const DatePeriodSegment = ({
  period,
}: {
  period: { start_date: string | null; end_date: string | null } | null;
}) => {
  if (!period) return null;

  const startDate = period.start_date ? DateUtils.getLocalizedDate(period.start_date, "MMM yyyy") : "";
  const endDate = period.end_date ? DateUtils.getLocalizedDate(period.end_date, "MMM yyyy") : "";

  return (
    <Typography size="labels-input-m" className="font-primary! text-secondary-50">
      {startDate} {startDate && endDate ? " - " : ""} {endDate}
    </Typography>
  );
};
