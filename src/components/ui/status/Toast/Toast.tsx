import Button from "@mui/material/Button";
import { cva, VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { ToastContainer as ToastifyToastContainer, TypeOptions as ToastifyVariants } from "react-toastify";

import { Loader } from "@/components/ui/status/Loader/Loader";
import { statusIcon, StatusParams, statusSeparator } from "@/components/ui/status/shared/status";
import { Typography } from "@/components/ui/text/Typography/Typography";

const toastContainer = cva("m-8 w-auto p-0", {
  variants: {
    position: {
      "bottom-right": "right-0 bottom-0",
      "bottom-left": "bottom-0 left-0",
      "top-right": "top-0 right-0",
      "top-left": "top-0 left-0",
      "bottom-center": "bottom-0",
      "top-center": "top-0",
    },
  },
});

const toastWrapper = cva("max-w-toast bg-secondary-300 shadow-4 min-h-0 w-auto overflow-hidden rounded-sm border p-0", {
  variants: {
    variant: {
      neutral: "border-secondary-75",
      success: "border-success bg-success-75!",
      warning: "border-warning",
      error: "border-danger",
    },
    position: {
      "bottom-right": "mt-8",
      "bottom-left": "mt-8",
      "bottom-center": "mt-8",
      "top-right": "mb-8",
      "top-left": "mb-8",
      "top-center": "mb-8",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

type ToastVariantProps = VariantProps<typeof toastWrapper>;

export type ToastPosition = ToastVariantProps["position"];

type ToastProps = ToastVariantProps & StatusParams;

export const Toast = ({ variant, text, isLoading = false, actions = [], icon: Icon }: ToastProps) => {
  return (
    <div className="t:flex-row flex w-auto flex-col items-center">
      <div className="py-3-5 flex items-center gap-3 px-4">
        {isLoading && <Loader size="default" className="shrink-0" />}
        {!isLoading && Icon && <Icon className={statusIcon({ variant })} />}
        <Typography
          size="labels-s"
          className={clsx(
            "font-weight-500",
            variant === "error" || variant === "neutral" ? "text-white" : "text-black",
          )}
        >
          {text}
        </Typography>
      </div>
      {actions.length > 0 && (
        <>
          <div className={statusSeparator({ variant })} />
          <div className="t:w-auto t:justify-center flex w-full shrink-0 flex-wrap items-center justify-end gap-4 px-4 py-3">
            {actions.map(({ text: buttonText, onPress, className }) => (
              <Button variant="text" key={buttonText} onClick={onPress} className={className}>
                {buttonText}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const toastifyVariantToVariant: Record<ToastifyVariants, ToastVariantProps["variant"]> = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "neutral",
  default: "neutral",
};

export const ToastContainer = () => {
  return (
    <ToastifyToastContainer
      className={(params) => {
        return toastContainer({
          position: params?.position,
          className: params?.defaultClassName,
        });
      }}
      toastClassName={(params) => {
        const variantParam: ToastifyVariants = params?.type || "default";
        const variant = toastifyVariantToVariant[variantParam];
        return toastWrapper({
          variant,
          position: params?.position,
          className: params?.defaultClassName,
        });
      }}
      autoClose={2500}
      icon={false}
      closeButton={false}
      hideProgressBar
    />
  );
};
