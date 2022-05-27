import { IFeatureFlagContext, IUseFeatureFlagHookProps } from '../types';
import { FeatureFlagReactContext } from '../constants';
import React, { PropsWithChildren } from 'react';
import { useFeatureFeatureFlagProvider } from '../hooks/hooks';

export function FeatureFlagProvider<KEYS extends string, PROPS extends string>({
  children,
  ...props
}: PropsWithChildren<IUseFeatureFlagHookProps<KEYS, PROPS>>) {
  const context = useFeatureFeatureFlagProvider(props);
  return (
    <FeatureFlagProviderRaw {...context}>{children}</FeatureFlagProviderRaw>
  );
}

export const FeatureFlagProviderRaw: React.FC<IFeatureFlagContext<any>> = ({
  flags,
  identify,
  loading,
  children,
}) => {
  return (
    <FeatureFlagReactContext.Provider
      value={{
        flags,
        identify,
        loading,
      }}>
      {children}
    </FeatureFlagReactContext.Provider>
  );
};
