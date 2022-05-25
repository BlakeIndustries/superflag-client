import {IFeatureFlagContext, IUseFeatureFlagHookProps} from '../types';
import {FeatureFlagReactContext} from '../constants';
import React, {PropsWithChildren} from 'react';
import {useFeatureFlagProvider} from '../hooks/hooks';

export function FlagProvider<KEYS extends string, PROPS extends string>({
  children,
  ...props
}: PropsWithChildren<IUseFeatureFlagHookProps<KEYS, PROPS>>) {
  const context = useFeatureFlagProvider(props);
  return <FlagProviderRaw {...context}>{children}</FlagProviderRaw>;
}

export const FlagProviderRaw: React.FC<IFeatureFlagContext<any>> = ({
  flags,
  identify,
  loading,
  children,
}) => {
  return <FeatureFlagReactContext.Provider value={{
    flags,
    identify,
    loading,
  }}>{children}</FeatureFlagReactContext.Provider>;
};
