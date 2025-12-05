import { Header } from "@tanstack/react-table";
import { cx } from "class-variance-authority";
import { PropsWithChildren } from "react";

import { Typography } from "@/components/ui/text/Typography/Typography";
import { ArrowDropUpIcon } from "@/assets/icons/general/ArrowDropUp";

interface IProps extends PropsWithChildren {
  header?: Header<any, unknown>;
  label?: string;
  align?: "start" | "center" | "end";
}

const TableHeaderCell = ({ header, label, align = "start" }: IProps) => {
  const sortingState = {
    asc: "rotate-0",
    desc: "rotate-180",
    false: "opacity-0",
  };

  return (
    <div
      {...{
        className: cx(
          "flex items-center gap-1 p-3 min-w-11",
          header?.column.getCanSort() && "cursor-pointer select-none",
          align === "start" && "justify-start",
          align === "center" && "justify-center",
          align === "end" && "justify-end",
        ),

        onClick: header?.column.getToggleSortingHandler(),
      }}
    >
      <Typography
        size="body-paragraph-m"
        className={cx(
          "text-text-default-primary relative",
          header?.column.getIsSorted() ? "font-body-prominent-2" : "font-body-default",
        )}
        as="span"
      >
        {label}
        {header?.column.getCanSort() && (
          <div className="absolute -right-6 -top-0-5 h-6 w-6">
            <ArrowDropUpIcon
              className={cx(
                "text-text-default-primary h-6 w-6 transition-all duration-500 ease-in-out",
                sortingState[header?.column.getIsSorted() as "asc" | "desc" | "false"] ?? null,
              )}
            />
          </div>
        )}
      </Typography>
    </div>
  );
};

export default TableHeaderCell;
