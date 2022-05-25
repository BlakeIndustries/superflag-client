import { IFeatureFlagContext } from '../types';
import React, { PropsWithChildren } from 'react';
import { FeatureFlagReactContext } from '../constants';

export function MockFlagProvider<
  KEYS extends string,
  PROPS extends string = any
>({
  flags,
  identify = () => {},
  loading = false,
  children,
}: PropsWithChildren<Partial<IFeatureFlagContext<KEYS, PROPS>>>): JSX.Element {
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
}
