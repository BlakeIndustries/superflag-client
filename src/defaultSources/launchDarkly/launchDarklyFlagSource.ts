import { TFeatureFlagSource } from '../../types';
// @ts-ignore
import * as LDClient from 'launchdarkly-js-client-sdk';

/**
 * creates a flag source that fetches flag values from LaunchDarkly
 * @param clientId the launchDarkly client ID
 */
export const createLaunchDarklyFlagSource = <KEYS extends string>(
  clientId: string
): TFeatureFlagSource<
  KEYS,
  | 'key'
  | 'secondary'
  | 'name'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'avatar'
  | 'ip'
  | 'country'
  | 'anonymous'
  | 'custom'
  | 'privateAttributeNames'
  | string
> => {
  return async (userInfo) => {
    const client = LDClient.initialize(clientId, userInfo as LDClient.LDUser);
    await client.waitUntilReady();
    return (
      (Object.fromEntries(
        Object.entries(client.allFlags()).map(([key, value]) => [key, !!value])
      ) as Record<KEYS, boolean>) ?? {}
    );
  };
};
