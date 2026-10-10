import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  InvalidateQueryOptions,
  invalidateQueries,
  QueryModule,
} from "@/data/invalidateQueries";
import { CommonModels } from "@/data/common/common.models";
import { AppMutationOptions } from "@/types/react-query";

/**
 * Staff registration mutations (non-codegen).
 *
 * After BE ships and codegen is regenerated, replace each mock `mutationFn`
 * with the generated `RegistrationsApi.*` / `RegistrationsQueries.use*` calls
 * and delete this file if hooks move into registrations.queries.ts.
 *
 * See docs/staff-registration-edit.md for required endpoints.
 */

export type StaffParticipantPayload = {
  firstName: string;
  lastName: string;
  gender: CommonModels.ParticipantGenderEnum;
  dateOfBirth: string;
  weight: number;
  beltLevel: CommonModels.BeltEnum;
};

export type StaffCreateVariables = {
  tournamentId: string;
  categoryId: string;
  clubId?: string;
  participant: StaffParticipantPayload;
};

export type StaffUpdateVariables = {
  registrationId: string;
  participant: StaffParticipantPayload;
  finalWeight?: number;
};

export type StaffRemoveVariables = {
  registrationId: string;
};

const delay = (ms = 400) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

/** MOCK — replace with RegistrationsApi.staffCreate (or equivalent) after codegen. */
const mockStaffCreate = async (_variables: StaffCreateVariables) => {
  await delay();
  return { ok: true as const };
};

/** MOCK — replace with RegistrationsApi.staffUpdate / PATCH /registrations/:id after codegen. */
const mockStaffUpdate = async (_variables: StaffUpdateVariables) => {
  await delay();
  return { ok: true as const };
};

/** MOCK — replace with RegistrationsApi.staffRemove / DELETE /registrations/:id after codegen. */
const mockStaffRemove = async (_variables: StaffRemoveVariables) => {
  await delay();
  return { ok: true as const };
};

export namespace RegistrationsStaffQueries {
  export const moduleName = QueryModule.Registrations;

  export const useStaffCreate = (
    options?: AppMutationOptions<typeof mockStaffCreate, StaffCreateVariables> &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: mockStaffCreate,
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, {
          invalidateCurrentModule: true,
          ...options,
        });
        options?.onSuccess?.(...args);
      },
    });
  };

  export const useStaffUpdate = (
    options?: AppMutationOptions<typeof mockStaffUpdate, StaffUpdateVariables> &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: mockStaffUpdate,
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, {
          invalidateCurrentModule: true,
          ...options,
        });
        options?.onSuccess?.(...args);
      },
    });
  };

  export const useStaffRemove = (
    options?: AppMutationOptions<typeof mockStaffRemove, StaffRemoveVariables> &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: mockStaffRemove,
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, {
          invalidateCurrentModule: true,
          ...options,
        });
        options?.onSuccess?.(...args);
      },
    });
  };
}
