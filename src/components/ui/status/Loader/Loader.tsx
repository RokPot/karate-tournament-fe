import { VariantProps, cva } from "class-variance-authority";

const loaderWrapper = cva("flex items-center justify-center", {
  variants: {
    size: {
      default: "h-6 w-6",
      m: "h-12 w-12",
      l: "h-16 w-16",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

const loader = cva("animate-loader-spin", {
  variants: {
    size: {
      default: "h-3-5 w-3-5",
      m: "h-6 w-6",
      l: "h-8 w-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type LoaderVariantProps = VariantProps<typeof loader>;

type LoaderProps = LoaderVariantProps & React.SVGProps<SVGSVGElement>;

export const Loader = ({ size, className, ...props }: Omit<LoaderProps, "color">) => {
  return (
    <div className={loaderWrapper({ size, className })}>
      <svg
        className={loader({ size, className })}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
      >
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};
