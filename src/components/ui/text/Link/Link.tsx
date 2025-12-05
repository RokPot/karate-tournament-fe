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
        "text-primary-300 underline focus-visible:outline-secondary-200",
        "active:text-secondary-100 hover:text-secondary-200 focus-visible:text-secondary-200",
        props.className,
      )}
    />
  );
};
