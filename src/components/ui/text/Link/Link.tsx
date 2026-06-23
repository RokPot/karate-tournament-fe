import clsx from "clsx";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { PropsWithChildren } from "react";

import { uiOutlineClass } from "@/components/ui/global/outline";

type LinkProps = PropsWithChildren<NextLinkProps> & {
  className?: string;
  target?: string;
};

export const Link = (props: LinkProps) => {
  return (
    <NextLink
      {...props}
      className={clsx(
        uiOutlineClass,
        "text-tertiary-200 underline focus-visible:outline-primary-300",
        "active:text-tertiary-400 hover:text-tertiary-300 focus-visible:text-tertiary-300",
        props.className,
      )}
    />
  );
};
