import { Dialog } from "@mui/material";

interface IProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

const CustomDialog = ({ open, onClose, children, maxWidth = "sm" }: IProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth classes={{
            paper: "!bg-primary-200 !text-secondary-500 dark:!bg-secondary-500 dark:!text-white",
        }}>
            {children}
        </Dialog>
    );
};

export default CustomDialog;