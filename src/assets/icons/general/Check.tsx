import * as React from "react";
import type { SVGProps } from "react";

export const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="fill-current" {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M20.707 5.293a1 1 0 0 1 0 1.414l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L9 15.586 19.293 5.293a1 1 0 0 1 1.414 0"
      clipRule="evenodd"
    />
  </svg>
);
