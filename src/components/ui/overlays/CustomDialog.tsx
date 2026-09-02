import { Dialog } from "@mui/material";

interface IProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
    disableDismiss?: boolean;
}

const CustomDialog = ({
    open,
    onClose,
    children,
    maxWidth = "sm",
    disableDismiss = false,
}: IProps) => {
    return (
        <Dialog
            open={open}
            onClose={(_event, reason) => {
                if (
                    disableDismiss &&
                    (reason === "backdropClick" || reason === "escapeKeyDown")
                ) {
                    return;
                }
                onClose();
            }}
            maxWidth={maxWidth}
            fullWidth
            disableEscapeKeyDown={disableDismiss}
            classes={{
            paper: "!bg-primary-200 !text-secondary-500 dark:!bg-secondary-500 dark:!text-white",
        }}>
            {children}
        </Dialog>
    );
};

export default CustomDialog;