import React, { PropsWithChildren, ReactNode } from 'react';
import { useFeatureFlag } from '../hooks';

interface FeatureFlagSwitchProps<KEYS extends string> {
  flagKey: KEYS;
  whenTrue?: ReactNode;
  whenFalse?: ReactNode;
}

export function FeatureFlagSwitch<KEYS extends string>({
  flagKey,
  whenTrue,
  whenFalse,
}: PropsWithChildren<FeatureFlagSwitchProps<KEYS>>): JSX.Element {
  return <>{useFeatureFlag(flagKey) ? whenTrue : whenFalse}</>;
}
