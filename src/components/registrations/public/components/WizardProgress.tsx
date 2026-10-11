import { CheckIcon } from "@/assets/icons/general/Check";
import { Typography } from "@/components/ui/text/Typography/Typography";

type WizardProgressProps = {
  currentIndex: number;
  labels: string[];
};

export function WizardProgress({ currentIndex, labels }: WizardProgressProps) {
  return (
    <ol className="relative flex flex-col gap-0 border-b border-secondary-300 bg-secondary-75 px-6 py-4 sm:flex-row sm:items-start md:px-10 lg:px-20 md:h-[100px]! md:items-center">
      {labels.map((label, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li
            key={label}
            className="relative flex min-w-0 flex-1 gap-3 sm:flex-col sm:items-center sm:gap-2 sm:px-1 sm:text-center"
          >
            {index < labels.length - 1 && (
              <>
                <span
                  aria-hidden
                  className="absolute left-[13px] top-7 bottom-0 w-[2px] bg-primary-100 sm:hidden"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-[13px] left-[calc(50%+14px)] z-0 hidden h-[2px] w-[calc(100%-28px)] bg-primary-100 sm:block"
                />
              </>
            )}
            <span
              className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border text-primary-400 ${isComplete
                ? "border-primary-200 bg-primary-200 text-white"
                : isCurrent
                  ? "border-primary-200 bg-primary-75"
                  : "border-secondary-400 bg-secondary-200 text-neutral-200"
                }`}
            >
              {isComplete ? (
                <CheckIcon className="size-4 text-white" aria-hidden />
              ) : (
                <Typography
                  size="body-paragraph-s"
                  variant="prominent-2"
                  as="span"
                >
                  {index + 1}
                </Typography>
              )}
            </span>
            <Typography
              size="body-paragraph-s"
              className={`pb-5 sm:pb-0 ${isCurrent
                ? "text-neutral-400"
                : isComplete
                  ? "text-neutral-300"
                  : "text-neutral-200"
                }`}
            >
              {label}
            </Typography>
          </li>
        );
      })}
    </ol>
  );
}
