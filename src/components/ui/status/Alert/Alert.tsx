import Button from "@mui/material/Button";
import { cva, VariantProps } from "class-variance-authority";

import { Loader } from "@/components/ui/status/Loader/Loader";
import { statusIcon, StatusParams, statusSeparator } from "@/components/ui/status/shared/status";
import { Typography } from "@/components/ui/text/Typography/Typography";

const alert = cva("bg-secondary-300 min-h-0 overflow-hidden rounded-sm border p-0", {
  variants: {
    variant: {
      neutral: "border-secondary-75",
      success: "border-success",
      warning: "border-warning",
      error: "border-danger",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

type AlertVariantProps = VariantProps<typeof alert>;

type AlertProps = AlertVariantProps &
  StatusParams & {
    className?: string;
  };

export const Alert = ({ variant, text, isLoading = false, actions = [], icon: Icon, className }: AlertProps) => {
  return (
    <div className={alert({ variant, className })}>
      <div className="t:flex-row flex w-auto flex-col items-center">
        <div className="py-3-5 flex w-full items-start gap-3 px-4">
          {isLoading && <Loader size="default" className="shrink-0" />}
          {!isLoading && Icon && <Icon className={statusIcon({ variant })} />}
          <Typography size="labels-lg" className="text-secondary-500">
            {text}
          </Typography>
        </div>
        {actions.length > 0 && (
          <>
            <div className={statusSeparator({ variant })} />
            <div className="t:w-auto t:justify-center flex w-full shrink-0 flex-wrap items-center justify-end gap-4 px-4 py-3">
              {actions.map(({ text: buttonText, onPress }) => (
                <Button variant="text" key={buttonText} onClick={onPress}>
                  {buttonText}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
