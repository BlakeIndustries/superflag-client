import {TFeatureFlags, TFeatureFlagSource} from '../types';

export const createConstantFlagSource = <KEYS extends string>(flags?: TFeatureFlags<KEYS>): TFeatureFlagSource<KEYS, any> => {
  return () => Promise.resolve(flags ?? {});
};
