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
        "text-primary-200 underline focus-visible:outline-secondary-300",
        "active:text-primary-400 hover:text-primary-300 focus-visible:text-primary-300",
        props.className,
      )}
    />
  );
};
