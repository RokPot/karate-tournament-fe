import { z } from "zod";

import i18n from "@/config/i18n";

export namespace SharedModels {
  export const PaginationDtoScehma = z.object({
    current_page: z.number(),
    prev_page: z.number().nullable(),
    next_page: z.number().nullable(),
    total_pages: z.number(),
  });

  export type PaginationDto = z.infer<typeof PaginationDtoScehma>;

  export interface PageableDto {
    meta: { pagination: PaginationDto };
  }

  export const EmptySchema = z.object({});

  export const EmailModel = z
    .string()
    .email(i18n.t("auth.shared.email.invalid"))
    .min(1, i18n.t("auth.shared.email.required"));

  export const OptionalEmailModel = z.string().email(i18n.t("auth.shared.email.invalid")).optional();

  export const PasswordModel = z
    .string()
    .min(6, i18n.t("auth.shared.password.weak"))
    .min(1, i18n.t("auth.shared.password.required"));
}
