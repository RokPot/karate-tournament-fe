import type { LayoutConnector } from "../layout/computeSingleEliminationLayout";

interface BracketConnectorsProps {
  width: number;
  height: number;
  connectors: LayoutConnector[];
  className?: string;
}

export const BracketConnectors = ({
  width,
  height,
  connectors,
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
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      ))}
    </svg>
  );
};
