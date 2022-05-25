import {useContext, useEffect, useState} from 'react';
import {TIdentifyParams, IUseFeatureFlagHookProps, IFeatureFlagContext, TFeatureFlags} from '../types';
import {DefaultFeatureFlagCacheKey, FeatureFlagReactContext} from '../constants';

function reduceFlagsToOnlyPositives<KEYS extends string>(flags?: TFeatureFlags<KEYS>) {
  return Object.fromEntries(Object.entries(flags ?? {}).filter(([key, value]) => !!value));
}

const encodeBase64 = btoa;
const decodeBase64 = atob;

function loadFlagsFromCache<KEYS extends string>(
  cacheKey: string,
  obfuscateCache?: boolean,
  flagKeys?: KEYS[],
): TFeatureFlags<KEYS> {
  return {
    ...Object.fromEntries(flagKeys?.map(key => [key, false]) ?? []),
    ...JSON.parse(
      obfuscateCache ?
        decodeBase64(localStorage.getItem(encodeBase64(
            cacheKey)) ??
          encodeBase64('{}')) :
        localStorage.getItem(cacheKey) ?? '{}'),
  };
}

export const useFeatureFlagProvider = <KEYS extends string, PROPS extends string>({
  flagSource,
  flagKeys,
  obfuscateCache,
  cacheKey = DefaultFeatureFlagCacheKey,
  refetchOnChange = [],
  skip,
}: IUseFeatureFlagHookProps<KEYS, PROPS>): IFeatureFlagContext<KEYS, PROPS> => {
  const [flags, setFlags] = useState<TFeatureFlags<KEYS>>(
    loadFlagsFromCache(cacheKey, obfuscateCache, flagKeys));
  const [loading, setLoading] = useState(false);
  const [lastIdentification, setLastIdentification] = useState<TIdentifyParams<PROPS>>();

  function refetchFlags(props: TIdentifyParams<PROPS>) {
    setLoading(true);
    flagSource(props).then(result => {
      setFlags(result);
      setLoading(false);
    });
  }

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
      localStorage.setItem(encodeBase64(cacheKey), encodeBase64(JSON.stringify(reduceFlagsToOnlyPositives(flags))));
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

export const useFeatureFlagContext = <KEYS extends string, PROPS extends string>(): IFeatureFlagContext<KEYS, PROPS> => {
  return useContext(FeatureFlagReactContext);
};
export const useFeatureFlags = <KEYS extends string>(): TFeatureFlags<KEYS> => {
  return useContext(FeatureFlagReactContext).flags ?? {};
};
export const useFeatureFlag = (key: string): boolean => {
  return !!useFeatureFlags()[key];
};
