import { cx } from "class-variance-authority";

import TableCell from "@/components/ui/table/TableCell";
import { Typography } from "@/components/ui/text/Typography/Typography";

export const TableTypographyCell = ({
  value,
  className,
  align = "start",
}: {
  value: string;
  className?: string;
  align?: "start" | "center" | "end";
}) => {
  return (
    <TableCell align={align}>
      <Typography size="body-paragraph-m" variant="default" className={cx("min-w-20 truncate", className)}>
        {value}
      </Typography>
    </TableCell>
  );
};
