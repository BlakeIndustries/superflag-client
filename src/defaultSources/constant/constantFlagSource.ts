import { TFeatureFlags, TFeatureFlagSource } from '../../types';

/**
 * creates a flag source from a constant flag object
 * @param flags the constant flags to return
 */
export const createConstantFlagSource = <KEYS extends string>(
  flags?: TFeatureFlags<KEYS>
): TFeatureFlagSource<KEYS, any> => {
  return () => Promise.resolve(flags ?? {});
};
