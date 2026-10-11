import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import { forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { Typography } from "@/components/ui/text/Typography/Typography";
import { useAuthUser } from "@/hooks/useAuthUser";

import { COACH_FORM_DEFAULTS } from "../../constants";
import type { CoachDetails } from "../../types";

const CoachDetailsSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  clubName: z.string().max(200).optional(),
});

export type CoachDetailsFormValues = z.infer<typeof CoachDetailsSchema>;

export interface CoachDetailsFormHandle {
  submit: () => Promise<CoachDetails | null>;
}

interface CoachDetailsFormProps {
  disabled?: boolean;
  initialValues?: Partial<CoachDetails> | null;
}

export const CoachDetailsForm = forwardRef<
  CoachDetailsFormHandle,
  CoachDetailsFormProps
>(function CoachDetailsForm({ disabled = false, initialValues }, ref) {
  const { t } = useTranslation();
  const authUser = useAuthUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoachDetailsFormValues>({
    resolver: zodResolver(CoachDetailsSchema),
    defaultValues: {
      email:
        initialValues?.email ?? authUser?.email ?? COACH_FORM_DEFAULTS.email,
      firstName:
        initialValues?.firstName ??
        authUser?.firstName ??
        COACH_FORM_DEFAULTS.firstName,
      lastName:
        initialValues?.lastName ??
        authUser?.lastName ??
        COACH_FORM_DEFAULTS.lastName,
      clubName:
        initialValues?.clubName ??
        authUser?.club?.name ??
        COACH_FORM_DEFAULTS.clubName,
    },
  });

  useImperativeHandle(ref, () => ({
    submit: () =>
      new Promise<CoachDetails | null>((resolve) => {
        handleSubmit(
          (data) => {
            resolve({
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              clubName: data.clubName?.trim() || undefined,
            });
          },
          () => resolve(null),
        )();
      }),
  }));

  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
      <Typography size="h3">
        {t("registrations.public.contactSectionTitle")}
      </Typography>
      <Typography size="body-paragraph-s" className="text-neutral-200">
        {t("registrations.public.contactSectionHint")}
      </Typography>

      <TextField
        label={t("registrations.public.coachEmail")}
        type="email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
        required
        disabled={disabled}
      />

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label={t("registrations.public.coachFirstName")}
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
          fullWidth
          required
          disabled={disabled}
        />
        <TextField
          label={t("registrations.public.coachLastName")}
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
          fullWidth
          required
          disabled={disabled}
        />
      </div>

      <TextField
        label={`${t("registrations.public.clubName")} (${t("registrations.public.clubNameOptional")})`}
        {...register("clubName")}
        error={!!errors.clubName}
        helperText={errors.clubName?.message}
        fullWidth
        disabled={disabled}
      />
    </form>
  );
});
