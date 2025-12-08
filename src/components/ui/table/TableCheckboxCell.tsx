import Checkbox from "@mui/material/Checkbox";

interface IProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const TableCheckboxCell = ({ className, checked, onChange }: IProps) => {
  return (
    <div className="flex w-full cursor-pointer items-center p-3">
      <Checkbox
        checked={!!checked}
        className={`${className} w-1 cursor-pointer`}
        onChange={(e) => {
          onChange?.((e.target as HTMLInputElement).checked);
        }}
      />
    </div>
  );
};

export default TableCheckboxCell;
