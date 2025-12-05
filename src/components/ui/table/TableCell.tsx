import clsx from "clsx";
import { PropsWithChildren } from "react";

interface IProps extends PropsWithChildren {
  className?: string;
  onClick?: () => void;
  align?: "start" | "center" | "end";
}

const TableCell = ({ children, className, onClick, align = "center" }: IProps) => {
  return (
    <div
      className={clsx(
        "flex w-full items-center truncate p-3",
        onClick && "cursor-pointer",
        className,
        align === "start" && "justify-start",
        align === "center" && "justify-center",
        align === "end" && "justify-end",
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default TableCell;
