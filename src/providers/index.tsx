import React from "react";

type HasRequiredProperty<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? never : K;
}[keyof T];

type ProviderBase<T> = {
  provider: T;
};

type ProviderProps<T extends keyof React.JSX.IntrinsicElements> = {
  props: Omit<React.ComponentProps<T>, "children">;
};

type ProvidersArray<T extends any[]> = [
  ...{
    [K in keyof T]: HasRequiredProperty<Omit<React.ComponentProps<T[K]>, "children">> extends never
      ? ProviderBase<T[K]> & Partial<ProviderProps<T[K]>>
      : ProviderBase<T[K]> & ProviderProps<T[K]>;
  },
];

interface Props<T extends any[]> {
  providers: ProvidersArray<T>;
  children: React.ReactNode;
}

function Providers<T extends any[]>({ providers, children }: Props<T>) {
  return (
    <>
      {providers.reduceRight(
        (child, { provider: Provider, props }) => (
          <Provider {...props}>{child}</Provider>
        ),
        children,
      )}
    </>
  );
}

export default Providers;
