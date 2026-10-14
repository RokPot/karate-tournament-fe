import clsx from "clsx";

import { Typography } from "@/components/ui/text/Typography/Typography";
import Image, { StaticImageData } from "next/image";

interface LandingImagePlaceholderProps {
  label: string;
  aspectRatio?: string;
  className?: string;
  alt?: string;
  image?: StaticImageData;
  objectPosition?: string;
  scale?: number;
  origin?: string;
}

export const LandingImagePlaceholder = ({
  label,
  aspectRatio = "aspect-[4/5]",
  className,
  alt,
  image,
  objectPosition,
  scale,
  origin,
}: LandingImagePlaceholderProps) => {
  if (image) {
    return (
      <LandingImage
        image={image}
        alt={alt}
        aspectRatio={aspectRatio}
        className={className}
        objectPosition={objectPosition}
        scale={scale}
        origin={origin}
      />
    );
  }
  return (
    <div
      className={clsx(
        "flex w-full items-center justify-center rounded-2xl border border-dashed border-secondary-400 bg-secondary-100 text-neutral-200",
        aspectRatio,
        className,
      )}
    >
      <Typography size="labels-s">{label}</Typography>
    </div>
  );
};

export const LandingImage = ({
  image,
  alt,
  aspectRatio,
  className,
  objectPosition = "center",
  scale = 1,
  origin = "center",
}: Pick<
  LandingImagePlaceholderProps,
  "image" | "alt" | "aspectRatio" | "className" | "objectPosition" | "scale" | "origin"
>) => {
  if (!image) {
    return null;
  }

  if (!aspectRatio) {
    return (
      <Image
        src={image}
        alt={alt ?? ""}
        unoptimized
        className={clsx("h-auto w-full rounded-2xl", className)}
      />
    );
  }

  return (
    <div className={clsx("relative w-full overflow-hidden rounded-2xl", aspectRatio, className)}>
      <Image
        src={image}
        alt={alt ?? ""}
        fill
        unoptimized
        sizes="(min-width: 1024px) 380px, 100vw"
        className="object-cover"
        style={{
          objectPosition,
          ...(scale === 1 ? {} : { transform: `scale(${scale})`, transformOrigin: origin }),
        }}
      />
    </div>
  );
};
