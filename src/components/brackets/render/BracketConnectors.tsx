import type { LayoutConnector } from "@/components/brackets/core";

interface BracketConnectorsProps {
  width: number;
  height: number;
  connectors: LayoutConnector[];
  color: string;
  className?: string;
}

export const BracketConnectors = ({
  width,
  height,
  connectors,
  color,
  className = "bracket-connector",
}: BracketConnectorsProps) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      aria-hidden="true"
    >
      {connectors.map((connector) => (
        <path
          key={connector.id}
          d={connector.d}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      ))}
    </svg>
  );
};
