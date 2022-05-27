import { IFeatureFlagSource, TIdentifyParams } from '../../types';
import * as LDClient from 'launchdarkly-js-client-sdk';

type LaunchDarklyIdentifiers =
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
  | string;

export class LaunchDarklyFlagSource<KEYS extends string>
  implements IFeatureFlagSource<KEYS, LaunchDarklyIdentifiers>
{
  /**
   * Constructs a flag source that fetches flag values from launchDarkly
   * @param clientId the launchDarkly client ID
   */
  constructor(private clientId: string) {}

  async fetchFlags(userInfo: TIdentifyParams<LaunchDarklyIdentifiers>) {
    const client = LDClient.initialize(
      this.clientId,
      userInfo as LDClient.LDUser
    );
    await client.waitUntilReady();
    return (
      (Object.fromEntries(
        Object.entries(client.allFlags()).map(([key, value]) => [key, !!value])
      ) as Record<KEYS, boolean>) ?? {}
    );
  }
}
