import { AuthGuard, AuthGuardProps } from "@/data/auth/AuthGuard";

export interface WithPrivateAuthGuardProps {
  privateAuthGuardProps?: Omit<AuthGuardProps, "type">;
}

export const withPrivateAuthGuard = <
  T extends React.PropsWithChildren & WithPrivateAuthGuardProps,
>(
  WrappedComponent: React.ComponentType<T & WithPrivateAuthGuardProps>,
) => {
  return ({
    privateAuthGuardProps,
    ...props
  }: T & WithPrivateAuthGuardProps) => {
    return (
      <AuthGuard type="private" {...privateAuthGuardProps}>
        <WrappedComponent {...(props as T)} />
      </AuthGuard>
    );
  };
};
