import { cx } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";

const DOTS = 3;
const ANIMATION_DURATION = 300;
const seqDots = [...Array<number>(DOTS).keys()];

type DotProps = {
  active: boolean;
  size: number;
  duration?: number;
  className?: string;
};

type TypeLoaderProps = {
  active: number;
  speed?: number;
  size?: number;
  className?: string;
  dotClassName?: string;
};

type LoaderProps = {
  size?: number;
  speed?: number;
  className?: string;
  dotClassName?: string;
};

export default function DotsLoader({ speed = ANIMATION_DURATION, size, className, dotClassName }: LoaderProps) {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(active > seqDots.length - 1 ? 0 : active + 1);
    }, speed);
    return () => clearInterval(interval);
  }, [active, speed]);

  return <ThreeDotsLoader {...{ active, size, className, dotClassName }} />;
}

const ThreeDotsLoader = ({ active, speed, size = 5, className, dotClassName }: TypeLoaderProps) => {
  return (
    <div className={`flex items-end ${className || ""}`}>
      {seqDots.map((i, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <Dot key={idx} active={i === active} duration={speed} size={size} className={dotClassName} />
      ))}
    </div>
  );
};

const Dot = ({ active, duration, size, className }: DotProps) => {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active && dotRef.current) {
      dotRef.current.animate([{ transform: "scale(1)" }, { transform: "scale(2)" }, { transform: "scale(1)" }], {
        duration: duration || ANIMATION_DURATION * 2,
        easing: "ease-in-out",
      });
    }
  }, [active, duration]);

  return (
    <div
      ref={dotRef}
      className={cx("rounded-full bg-secondary-300", className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        marginLeft: `${size * 0.75}px`,
        marginRight: `${size * 0.75}px`,
      }}
    />
  );
};
