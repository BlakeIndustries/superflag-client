import { useContext, useEffect, useState } from 'react';
import {
  IFeatureFlagContext,
  IUseFeatureFlagHookProps,
  TFeatureFlags,
  TIdentifyParams,
} from '../types';
import {
  DefaultFeatureFlagCacheKey,
  FeatureFlagReactContext,
} from '../constants';
import { Logger } from '../utils/logger';
import { decodeBase64, encodeBase64 } from '../utils/helpers';

function reduceFlagsToOnlyPositives<KEYS extends string>(
  flags?: TFeatureFlags<KEYS>
) {
  return Object.fromEntries(
    Object.entries(flags ?? {}).filter(([key, value]) => !!value)
  );
}

function loadFlagsFromCache<KEYS extends string>({
  cacheKey,
  obfuscateCache,
  flagKeys,
  defaultValues,
}: {
  cacheKey: string;
  obfuscateCache?: boolean;
  flagKeys?: KEYS[];
  defaultValues?: TFeatureFlags<KEYS>;
}): TFeatureFlags<KEYS> {
  const encodedCacheKey = obfuscateCache ? encodeBase64(cacheKey) : cacheKey;
  const storageItem = localStorage.getItem(encodedCacheKey);
  return {
    ...Object.fromEntries(flagKeys?.map((key) => [key, false]) ?? []),
    ...(storageItem
      ? JSON.parse(obfuscateCache ? decodeBase64(storageItem) : storageItem)
      : defaultValues ?? {}),
  };
}

/**
 * Helper hook that manages the feature flag state and source lifecycle. This
 * hook calls the init and fetch functions of the source object
 *
 * @param arg0 the flag configuration
 * @returns the feature flag context
 */
export const useFeatureFeatureFlagProvider = <
  KEYS extends string,
  PROPS extends string
>({
  flagSource,
  flagKeys,
  obfuscateCache,
  cacheKey = DefaultFeatureFlagCacheKey,
  refetchOnChange = [],
  skip,
  defaultValues,
}: IUseFeatureFlagHookProps<KEYS, PROPS>): IFeatureFlagContext<KEYS, PROPS> => {
  const [flags, setFlags] = useState<TFeatureFlags<KEYS>>(
    loadFlagsFromCache({
      cacheKey,
      obfuscateCache,
      defaultValues,
      flagKeys,
    })
  );
  const [loading, setLoading] = useState(false);
  const [lastIdentification, setLastIdentification] =
    useState<TIdentifyParams<PROPS>>();

  /**
   * refetch the flags and update the state
   */
  async function refetchFlags(props: TIdentifyParams<PROPS>) {
    try {
      setLoading(true);

      const result = await flagSource.fetchFlags(props);

      setFlags(result);
      setLoading(false);
    } catch (err) {
      Logger.error(err);
      if (defaultValues) {
        setFlags(defaultValues);
      }
      setLoading(false);
    }
  }

  // call the init function on init
  useEffect(() => {
    try {
      flagSource.init?.();

      if (flagSource.fetchOnInit) {
        refetchFlags({} as TIdentifyParams<PROPS>);
      }
    } catch (err) {
      Logger.error('error occurred while calling init', err);
    }
  }, []);

  // refetch on change params
  useEffect(() => {
    if (!skip && lastIdentification) {
      refetchFlags(lastIdentification);
    }
  }, [...refetchOnChange]);

  // cache to localStorage
  useEffect(() => {
    if (obfuscateCache) {
      // base64 encode the cache and remove extra props to obfuscate
      localStorage.setItem(
        encodeBase64(cacheKey),
        encodeBase64(JSON.stringify(reduceFlagsToOnlyPositives(flags)))
      );
    } else {
      localStorage.setItem(cacheKey, JSON.stringify(flags));
    }
  }, [flags, cacheKey, obfuscateCache]);

  return {
    flags,
    loading,
    identify: (props) => {
      setLastIdentification(props);

      refetchFlags(props);
    },
  };
};

/**
 * Fetches the feature flag context in its entirety from the React.Context
 *
 * @returns the entire feature flag context {@link IFeatureFlagContext}
 */
export const useFeatureFlagContext = <
  KEYS extends string,
  PROPS extends string
>(): IFeatureFlagContext<KEYS, PROPS> => {
  return useContext(FeatureFlagReactContext);
};

/**
 * Fetches the feature flag object from the feature flag context
 *
 * @returns the entire feature flag object
 */
export const useFeatureFlags = <KEYS extends string>(): TFeatureFlags<KEYS> => {
  return useContext(FeatureFlagReactContext).flags ?? {};
};

/**
 * Fetches a specific feature flag value from the feature flag context
 *
 * @param key the unique key of the flag to fetch
 * @returns the feature flag value coalesced into a boolean
 */
export const useFeatureFlag = <KEYS extends string>(key: KEYS): boolean => {
  return !!useFeatureFlags()[key];
};
