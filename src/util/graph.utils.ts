import Rand from "rand-seed";

import { DataPoint } from "@/types/graph.types";

const LINE_DATA_COUNT = 20;
const LAMBDA = 12; // Rate parameter of exponential distribution
const EXP_MEAN = 1 / LAMBDA;
const TIME_DELTA = 1; // Raises occur once a year

export namespace GraphUtils {
  export const generateExponentialRandom = (rand: Rand): number => {
    return -Math.log(1 - rand.next()) / LAMBDA;
  };

  export const createExponentialRandomNumberGenerator = (seed: string): (() => number) => {
    const rand = new Rand(seed);
    return () => generateExponentialRandom(rand);
  };

  export const generateLineData = (
    data: DataPoint[],
    marketDrift: number,
    volatility: number,
    initialValue: number,
    rand: () => number,
  ) => {
    const sqrtTimeDelta = Math.sqrt(TIME_DELTA);
    const marketDriftTimeDelta = marketDrift * TIME_DELTA;

    let value = initialValue;
    data.push({
      x: 0,
      value,
    });

    for (let i = 1; i < LINE_DATA_COUNT; i++) {
      const expRandom = rand();

      // Modified Geometric Brownian motion formula using exponential distribution
      const dW = expRandom * sqrtTimeDelta;

      // Scale the movement and add drift
      const dS = value * (marketDriftTimeDelta + volatility * dW);
      value += dS;

      data.push({
        x: i,
        value,
      });
    }
  };

  export const generateConeData = (
    data: DataPoint[],
    marketDrift: number,
    volatility: number,
    startValue: number,
    startX: number,
    count: number,
  ) => {
    for (let i = 0; i < count; i++) {
      const deviation = Math.sqrt(i) * volatility * EXP_MEAN;
      const meanValue = startValue * Math.exp(marketDrift * i);
      const upper = meanValue * Math.exp(deviation);
      const lower = meanValue * Math.exp(-deviation);
      data.push({
        x: startX + i,
        mean: meanValue,
        upper,
        lower,
        bands: [lower, upper],
      });
    }
  };
}
