import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

type Schema<ZResDto extends z.ZodRawShape, ResDto, Res> =
  | z.ZodEffects<z.ZodObject<ZResDto, "strip", z.ZodTypeAny, ResDto>, Res>
  | z.ZodSchema<Res>;

interface IProps<ZResDto extends z.ZodRawShape, ResDto, Res> {
  key: string;
  schema: Schema<ZResDto, ResDto, Res>;
}

export const useLocalStorage = <ZResDto extends z.ZodRawShape, ResDto, Res>({
  key,
  schema,
}: IProps<ZResDto, ResDto, Res>) => {
  const [value, setValue] = useState<Res | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!localStorage) {
      setValue(null);
      return;
    }

    try {
      const lsValue = localStorage.getItem(key);
      if (!lsValue) {
        setValue(null);
        return;
      }

      let jsonOrString: unknown;
      try {
        jsonOrString = JSON.parse(lsValue);
      } catch (e) {
        jsonOrString = lsValue;
      }

      const parsedValue = schema.safeParse(jsonOrString);

      if (parsedValue.success) {
        setValue(parsedValue.data);
      } else {
        setError(parsedValue.error);
        setValue(null);
      }
    } finally {
      setIsInitialLoading(false);
    }
  }, [key, schema]);

  const set = useCallback(
    (newValue: Res) => {
      if (!localStorage) {
        return;
      }

      const parsedValue = schema.safeParse(newValue);

      if (!parsedValue.success) {
        return;
      }

      if (typeof parsedValue.data === "string") {
        localStorage.setItem(key, parsedValue.data);
      } else {
        localStorage.setItem(key, JSON.stringify(parsedValue.data));
      }

      setValue(parsedValue.data);
    },
    [key, schema],
  );

  const remove = useCallback(() => {
    if (!localStorage) {
      return;
    }

    localStorage.removeItem(key);
    setValue(null);
  }, [key]);

  return { value, set, remove, error, isInitialLoading };
};
