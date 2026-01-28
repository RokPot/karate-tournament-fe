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
            paper: "!bg-secondary-500",
        }}>
            {children}
        </Dialog>
    );
};

export default CustomDialog;