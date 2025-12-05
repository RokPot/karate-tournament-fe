import axios, { AxiosError } from "axios";
import { z } from "zod";

export namespace RestUtils {
  export const doesServerErrorMessageContain = (e: AxiosError, text: string): boolean => {
    const message = extractServerErrorMessage(e);
    if (message == null) {
      return false;
    }

    return message.toLowerCase().includes(text.toLowerCase());
  };

  export const extractServerErrorMessage = (e: unknown): string | null => {
    if (e instanceof z.ZodError) {
      return e.message;
    }

    if (!axios.isAxiosError(e)) {
      return null;
    }

    if (!e.response) {
      return null;
    }

    const data = e.response.data as { message: unknown } | undefined;

    if (typeof data?.message === "string") {
      return data.message;
    }

    return null;
  };
}
