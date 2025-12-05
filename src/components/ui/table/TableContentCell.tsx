import TableCell from "@/components/ui/table/TableCell";

const TableContentCell = ({
  children,
  className,
  onClick,
  align = "center",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  align?: "start" | "center" | "end";
}) => {
  return (
    <TableCell onClick={onClick} className={className} align={align}>
      {children}
    </TableCell>
  );
};

export default TableContentCell;
