import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Typography } from "@/components/ui/text/Typography/Typography";
import { RegistrationsModels } from "@/data/registrations/registrations.models";
import { DateUtils } from "@/util/date.utils";

import type { ContinuePhase } from "../../hooks/useContinueRegistration";

const ContinueIdentitySchema = z.object({
  email: z.string().email(),
  clubName: z.string().max(200).optional(),
});

type ContinueIdentityValues = z.infer<typeof ContinueIdentitySchema>;

interface ContinueRosterPanelProps {
  phase: ContinuePhase;
  email?: string;
  clubName?: string;
  foundAt?: string | null;
  debugCode?: string;
  statusMessage?: string | null;
  replacePrompt: RegistrationsModels.RosterResponseDto | null;
  isBusy?: boolean;
  onCheck: (values: ContinueIdentityValues) => void;
  onContinue: () => void;
  onVerify: (code: string) => void;
  onResend: () => void;
  onConfirmReplace: () => void;
  onCancelReplace: () => void;
}

export function ContinueRosterPanel({
  phase,
  email,
  clubName,
  foundAt,
  debugCode,
  statusMessage,
  replacePrompt,
  isBusy = false,
  onCheck,
  onContinue,
  onVerify,
  onResend,
  onConfirmReplace,
  onCancelReplace,
}: ContinueRosterPanelProps) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(phase !== "idle" || !!replacePrompt);
  const [code, setCode] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<ContinueIdentityValues>({
    resolver: zodResolver(ContinueIdentitySchema),
    defaultValues: {
      email: email ?? "",
      clubName: clubName ?? "",
    },
  });

  useEffect(() => {
    if (phase !== "idle" || replacePrompt) {
      setOpen(true);
    }
  }, [phase, replacePrompt]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const current = getValues();
    if (current.email.trim() || !email) {
      return;
    }
    reset({
      email,
      clubName: current.clubName?.trim() || clubName || "",
    });
  }, [clubName, email, getValues, open, reset]);

  useEffect(() => {
    setCode(debugCode ?? "");
  }, [debugCode]);

  const foundDate = foundAt
    ? DateUtils.parseAndFormatDateTimeToLocaleShort(foundAt)
    : null;
  const codeReady = /^\d{6}$/.test(code);
  const showFound =
    !replacePrompt &&
    foundAt != null &&
    (phase === "found" || phase === "otp");
  const showOtp = !replacePrompt && phase === "otp";

  const toggle = () => {
    if (phase !== "idle" || replacePrompt) {
      setOpen(true);
      return;
    }
    setOpen((current) => !current);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-secondary-300" />
        <Typography size="body-paragraph-s" className="text-neutral-200">
          {t("registrations.public.continue.or")}
        </Typography>
        <div className="h-px flex-1 bg-secondary-300" />
      </div>

      <div className="flex justify-center">
        <Button
          variant="text"
          color="primary"
          onClick={toggle}
          disabled={isBusy && !open}
        >
          {t("registrations.public.continue.openExisting")}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="continue-existing"
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-4 rounded-lg border border-secondary-300 bg-secondary-75 p-4">
              <form
                className="flex flex-col gap-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSubmit((values) => {
                    onCheck({
                      email: values.email.trim(),
                      clubName: values.clubName?.trim() || undefined,
                    });
                  })();
                }}
              >
                <TextField
                  label={t("registrations.public.coachEmail")}
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                  required
                  disabled={isBusy}
                />
                <TextField
                  label={`${t("registrations.public.clubName")} (${t("registrations.public.clubNameOptional")})`}
                  {...register("clubName")}
                  error={!!errors.clubName}
                  helperText={errors.clubName?.message}
                  fullWidth
                  disabled={isBusy}
                />
                <div>
                  <Button type="submit" variant="contained" disabled={isBusy}>
                    {t("registrations.public.continue.check")}
                  </Button>
                </div>
              </form>

              {statusMessage && !showOtp && (
                <Typography size="body-paragraph-s">{statusMessage}</Typography>
              )}

              {replacePrompt && (
                <>
                  <Typography size="body-paragraph-m">
                    {t("registrations.public.continue.replaceDraft")}
                  </Typography>
                  <div className="flex flex-row flex-wrap gap-3">
                    <Button
                      variant="contained"
                      onClick={onConfirmReplace}
                      disabled={isBusy}
                    >
                      {t("registrations.public.continue.replace")}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={onCancelReplace}
                      disabled={isBusy}
                    >
                      {t("registrations.public.continue.keep")}
                    </Button>
                  </div>
                </>
              )}

              {showFound && (
                <Typography size="body-paragraph-m">
                  {foundDate
                    ? t("registrations.public.continue.found", { date: foundDate })
                    : t("registrations.public.continue.foundNoDate")}
                </Typography>
              )}

              {!replacePrompt && phase === "found" && !isBusy && (
                <Button variant="contained" onClick={onContinue} disabled={isBusy}>
                  {t("registrations.public.continue.continueEditing")}
                </Button>
              )}

              {showOtp && (
                <>
                  <Typography size="body-paragraph-m">
                    {t("registrations.public.continue.otpHint", {
                      email: email ?? "",
                    })}
                  </Typography>
                  {debugCode && (
                    <Typography size="body-paragraph-s" className="text-neutral-200">
                      {t("registrations.public.continue.debugCode", {
                        code: debugCode,
                      })}
                    </Typography>
                  )}
                  <TextField
                    label={t("registrations.public.continue.otpLabel")}
                    value={code}
                    onChange={(event) =>
                      setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    inputProps={{
                      inputMode: "numeric",
                      autoComplete: "one-time-code",
                    }}
                    error={!!statusMessage}
                    helperText={statusMessage ?? undefined}
                    fullWidth
                    disabled={isBusy}
                  />
                  <div className="flex flex-row flex-wrap gap-3">
                    <Button
                      variant="contained"
                      onClick={() => onVerify(code)}
                      disabled={isBusy || !codeReady}
                    >
                      {isBusy
                        ? t("registrations.public.continue.verifying")
                        : t("registrations.public.continue.verify")}
                    </Button>
                    <Button variant="outlined" onClick={onResend} disabled={isBusy}>
                      {t("registrations.public.continue.resend")}
                    </Button>
                  </div>
                </>
              )}

              {phase === "otp" && isBusy && !replacePrompt && (
                <Typography size="body-paragraph-s" className="text-neutral-200">
                  {t("registrations.public.continue.loading")}
                </Typography>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
