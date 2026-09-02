import { Typography } from "@/components/ui/text/Typography/Typography";
import { PropsWithChildren } from "react";

interface ProfileFieldProps {
  label: string;
}

export const ProfileField = ({
  label,
  children,
}: PropsWithChildren<ProfileFieldProps>) => {
  return (
    <div className="flex flex-col gap-1">
      <Typography size="labels-s" className="text-secondary-200">
        {label}
      </Typography>
      <div>{children}</div>
    </div>
  );
};
