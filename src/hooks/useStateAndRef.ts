import { useCallback, useRef, useState } from "react";

type StateRefReturn<T> = [T, React.MutableRefObject<T>, (value: React.SetStateAction<T>) => void];

const isFunction = <T>(setStateAction: React.SetStateAction<T>): setStateAction is (prevState: T) => T =>
  typeof setStateAction === "function";

export const useStateAndRef = <T>(initialState: T | (() => T)): StateRefReturn<T> => {
  const [state, setState] = useState<T>(initialState);
  const ref = useRef<T>(state);

  const updateValue = useCallback(
    (value: React.SetStateAction<T>) => {
      ref.current = isFunction(value) ? value(ref.current) : value;
      setState(ref.current);
    },
    [setState],
  );

  return [state, ref, updateValue];
};
