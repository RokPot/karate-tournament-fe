import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cva } from "class-variance-authority";
import { useTranslation } from "react-i18next";

import TableCell from "@/components/ui/table/TableCell";
import { Typography } from "@/components/ui/text/Typography/Typography";
import { CommonModels } from "@/data/common/common.models";

import { TOURNAMENT_STATUS_I18N_KEYS } from "./tournament-status";

const statusIcon = cva("h-6 w-6 shrink-0 mr-2", {
  variants: {
    variant: {
      pending: "stroke-warning text-warning",
      approved: "stroke-success text-success",
      declined: "stroke-danger text-danger",
    },
  },
  defaultVariants: {
    variant: "pending",
  },
});

interface TournamentStatusCellProps {
  status: CommonModels.TournamentsFindAllStatusEnum;
}

export const TournamentStatusCell = ({ status }: TournamentStatusCellProps) => {
  const { t } = useTranslation();

  return (
    <TableCell className="flex flex-row items-center gap-2" align="start">
      <Typography size="body-paragraph-s" >
        <FontAwesomeIcon icon={faCircle} className={statusIcon({ variant: status })} />
        {t(TOURNAMENT_STATUS_I18N_KEYS[status])}
      </Typography>
    </TableCell>
  );
};
