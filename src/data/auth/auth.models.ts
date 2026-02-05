import { z } from "zod";

import i18n from "@/config/i18n";
import { SharedModels } from "@/data/shared/shared.models";

export namespace AuthModels {
  export const LoginRequestSchema = z.object({
    email: SharedModels.EmailModel,
    password: z.string().min(1, i18n.t("auth.shared.password.required")),
  });

  export type LoginRequest = z.infer<typeof LoginRequestSchema>;

  export const RegisterRequestBaseSchema = z.object({
    email: SharedModels.EmailModel,
    password: SharedModels.PasswordModel,
  });

  export const RegisterRequestSchema = RegisterRequestBaseSchema.extend({});

  export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

  export const RegisterFormSchema = RegisterRequestBaseSchema.extend({});

  export type RegisterForm = z.infer<typeof RegisterFormSchema>;

  export type Provider = "auth0" | "cognito" | "custom-jwt";

  export type Method = "redirect" | "on-site" | "react-ui";

  export interface RegisterResult {
    status: "requires-login" | "requires-confirmation";
  }

  export const ResendConfirmRequestSchema = z.object({
    email: SharedModels.EmailModel,
  });

  export type ResendConfirmRequest = z.infer<typeof ResendConfirmRequestSchema>;

  export const ConfirmFormSchema = z.object({
    code: z.string().min(1, i18n.t("auth.shared.password.required")),
  });

  export type ConfirmForm = z.infer<typeof ConfirmFormSchema>;

  export const ConfirmRequestSchema = ConfirmFormSchema.extend({
    email: SharedModels.EmailModel,
  });

  export type ConfirmRequest = z.infer<typeof ConfirmRequestSchema>;

  export const ForgotPasswordRequestSchema = z.object({
    email: SharedModels.EmailModel,
  });

  export type ForgotPasswordRequest = z.infer<
    typeof ForgotPasswordRequestSchema
  >;

  export const ToForgotPasswordRequestDtoTransform =
    ForgotPasswordRequestSchema.transform((req) => ({
      email: req.email,
    }));

  export const ForgotPasswordResponseDtoSchema = z.object({});

  export const ToForgotPasswordResponseTransform =
    ForgotPasswordResponseDtoSchema.transform(() => ({}));

  export type ForgotPasswordResponse = z.infer<
    typeof ToForgotPasswordResponseTransform
  >;

  export const ResetPasswordRequestSchema = z.object({
    email: SharedModels.OptionalEmailModel,
    password: SharedModels.PasswordModel,
    code: z.string().min(1, i18n.t("auth.shared.password.required")),
  });

  export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;

  export const RefreshRequestSchema = z.object({
    refreshToken: z.string(),
  });

  export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;
  export const ToResetPasswordRequestDtoTransform =
    ResetPasswordRequestSchema.transform((req) => ({
      email: req.email,
      password: req.password,
      code: req.code,
    }));

  export const ResetPasswordResponseDtoSchema = z.object({});

  export const ToResetPasswordResponseTransform =
    ResetPasswordResponseDtoSchema.transform(() => ({}));

  export type ResetPasswordResponse = z.infer<
    typeof ToResetPasswordResponseTransform
  >;

  export const SocialProviderSchema = z.union([
    z.literal("google"),
    z.literal("facebook"),
    z.literal("amazon"),
    z.literal("apple"),
    z.literal("myprovider"), // a custom provider
  ]);

  export type SocialProvider = z.infer<typeof SocialProviderSchema>;

  export const SocialLoginProviderRequestSchema = z.object({
    provider: SocialProviderSchema,
  });

  export type SocialLoginProviderRequest = z.infer<
    typeof SocialLoginProviderRequestSchema
  >;

  export const SocialCallbackRequestSchema = z.object({
    code: z.string(),
    redirectUri: z.string(),
  });

  export type SocialCallbackRequest = z.infer<
    typeof SocialCallbackRequestSchema
  >;

  export const ToSocialCallbackRequestDtoTransform =
    SocialCallbackRequestSchema.transform((req) => ({
      code: req.code,
      redirectUri: req.redirectUri,
    }));

  export const SocialCredentialsResponseDtoSchema = z.object({
    baseUrl: z.string(),
    clientId: z.string(),
    responseType: z.string(),
    scopes: z.array(z.string()),
  });

  export type SocialCredentialsResponse = z.infer<
    typeof SocialCredentialsResponseDtoSchema
  >;

  export const ToSocialCredentialsResponseTransform =
    SocialCredentialsResponseDtoSchema.transform((res) => ({
      baseUrl: res.baseUrl,
      clientId: res.clientId,
      responseType: res.responseType,
      scopes: res.scopes,
    }));

  export const SocialLoginCallbackRequestSchema = z.object({
    provider: SocialProviderSchema,
    code: z.string().optional(),
    redirectUri: z.string().optional(),
  });

  export type SocialLoginCallbackRequest = z.infer<
    typeof SocialLoginCallbackRequestSchema
  >;
}
