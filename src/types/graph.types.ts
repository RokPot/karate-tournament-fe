export interface DataPoint {
  x: number;
  value?: number;
  mean?: number;
  upper?: number;
  lower?: number;
  bands?: number[];
}
