import { Button } from "@material-tailwind/react";
import { ToastPosition } from "react-toastify";

import { CheckIcon } from "@/assets/icons/general/Check";
import { StatusAction } from "@/components/ui/status/shared/status";

import { ToastContainer } from "./Toast";
import { useToast } from "./useToast";

type ToastConsumerProps = {
  position: ToastPosition;
  actions?: StatusAction[];
};

export const ToastStory = ({ actions, position }: ToastConsumerProps) => {
  return (
    <>
      <ToastContainer />
      <ToastConsumer position={position} actions={actions} />
    </>
  );
};

const ToastConsumer = ({ position, actions }: ToastConsumerProps) => {
  const { successToast, errorToast, neutralToast, warningToast } = useToast();

  return (
    <div>
      <Button
        variant="filled"
        onClick={() =>
          successToast({
            icon: CheckIcon,
            text: "This is a default sample of text, in order to display the default.",
            position,
            actions,
          })
        }
      >
        Success
      </Button>
      <Button
        variant="filled"
        onClick={() =>
          errorToast({
            icon: CheckIcon,
            text: "This is a default sample of text, in order to display the default.",
            position,
            actions,
          })
        }
      >
        Error
      </Button>
      <Button
        variant="filled"
        onClick={() =>
          neutralToast({
            icon: CheckIcon,
            text: "This is a default sample of text, in order to display the default.",
            position,
            actions,
          })
        }
      >
        Neutral
      </Button>
      <Button
        variant="filled"
        onClick={() =>
          warningToast({
            icon: CheckIcon,
            text: "This is a default sample of text, in order to display the default.",
            position,
            actions,
          })
        }
      >
        Warning
      </Button>
    </div>
  );
};
