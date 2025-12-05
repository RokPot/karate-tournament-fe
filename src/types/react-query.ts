import { UseInfiniteQueryOptions, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";

import { ApplicationException, GeneralErrorCodes } from "@/util/vendor/error-handling";

type Function = (...args: any) => any;
type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;
type IsAny<T> = IfAny<T, true, never>;
type IsUnknown<T, Y, N = T> = IsAny<T> extends never ? (unknown extends T ? Y : N) : N;

export type AppQueryOptions<
  TFunction extends Function,
  TData = Awaited<ReturnType<TFunction>>,
  TErrorCodes = GeneralErrorCodes,
> = Omit<
  UseQueryOptions<
    Awaited<ReturnType<TFunction>>,
    ApplicationException<TErrorCodes>,
    IsUnknown<TData, Awaited<ReturnType<TFunction>>>
  >,
  "queryKey" | "queryFn"
>;

export type AppMutationOptions<
  TFunction extends Function,
  TVariables = void,
  TData = Awaited<ReturnType<TFunction>>,
  TErrorCodes = GeneralErrorCodes,
> = Omit<UseMutationOptions<TData, ApplicationException<TErrorCodes>, TVariables>, "mutationKey" | "mutationFn">;

export type AppInfiniteQueryOptions<
  TFunction extends Function,
  TData = Awaited<ReturnType<TFunction>>,
  TErrorCodes = GeneralErrorCodes,
> = Omit<
  UseInfiniteQueryOptions<
    Awaited<ReturnType<TFunction>>,
    ApplicationException<TErrorCodes>,
    IsUnknown<TData, Awaited<ReturnType<TFunction>>>
  >,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
>;
