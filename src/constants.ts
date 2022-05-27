import React from 'react';
import { IFeatureFlagContext } from './types';

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
