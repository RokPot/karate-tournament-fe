import { useCallback } from "react";
import { Flip, ToastPosition, toast as showToast } from "react-toastify";

import { StatusParams } from "@/components/ui/status/shared/status";
import { CheckIcon } from "@/assets/icons/general/Check";

import { Toast } from "./Toast";

type IShowToast = StatusParams & {
  position?: ToastPosition;
  onClose?: () => void;
};

export const useToast = () => {
  const successToast = useCallback((params: IShowToast) => {
    showToast.success(<Toast variant="success" {...params} icon={CheckIcon} />, {
      position: params.position,
      transition: Flip,
      autoClose: 2000,
      closeOnClick: true,
    });
  }, []);

  const errorToast = useCallback((params: IShowToast) => {
    showToast.error(<Toast variant="error" {...params} />, {
      position: params.position,
      closeOnClick: true,
      transition: Flip,
      autoClose: 5000,
    });
  }, []);

  const warningToast = useCallback((params: IShowToast) => {
    showToast.warning(<Toast variant="warning" {...params} />, {
      position: params.position,
      transition: Flip,
    });
  }, []);

  const neutralToast = useCallback((params: IShowToast) => {
    const toast = showToast.info(<Toast variant="neutral" {...params} />, {
      position: params.position,
      transition: Flip,
      closeOnClick: true,
      autoClose: false,
      onClose: params.onClose,
    });
    return toast;
  }, []);

  return {
    successToast,
    errorToast,
    warningToast,
    neutralToast,
  };
};
