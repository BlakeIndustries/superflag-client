import React, { PropsWithChildren, ReactNode } from 'react';
import { useFeatureFlag } from '../hooks';

interface FeatureFlagGateProps<KEYS extends string> {
  flagKey: KEYS;
}

export function FeatureFlagGate<KEYS extends string>({
  flagKey,
  children,
}: PropsWithChildren<FeatureFlagGateProps<KEYS>>): JSX.Element {
  return <>{useFeatureFlag(flagKey) ? children : null}</>;
}
