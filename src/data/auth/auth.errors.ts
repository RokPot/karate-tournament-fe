export namespace AuthErrors {
  export type LoginErrorCodes =
    | "AUTH_LOGIN_INVALID_CREDENTIALS"
    | "NOT_CONFIRMED";

  export type RegisterErrorCodes =
    | "AUTH_REGISTER_EMAIL_TAKEN"
    | "WEAK_PASSWORD";

  export type ResetPasswordErrorCodes = "INVALID_CODE" | "WEAK_PASSWORD";
}
