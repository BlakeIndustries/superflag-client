import React from 'react';
import { IFeatureFlagContext } from './types';

/** the default `localStorage` key to use when caching the resolved feature flags */
export const DefaultFeatureFlagCacheKey = 'featureFlags';

export const FeatureFlagReactContext = React.createContext<
  IFeatureFlagContext<any, any>
>({
  flags: {},
  loading: true,
  identify: () => {
    throw new Error(
      'FeatureFlagProvider not initialized yet. Have you passed the parameters to the provider correctly?'
    );
  },
});
