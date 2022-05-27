export type TFeatureFlags<KEYS extends string> = Partial<Record<KEYS, boolean>>;

export type TIdentifyParams<PROPS extends string = string> = Record<
  PROPS,
  string | boolean | number | undefined
>;

export type TIdentifierFunction<PROPS extends string = any> = (
  props: TIdentifyParams<PROPS>
) => void;

/**
 * The working context of the feature flag system
 * @typeParam KEYS the union of all possible feature flag keys.
 *   E.g. `'useV2ui' | 'useNewPaymentGateway' | ...`
 */
export interface IFeatureFlagContext<
  KEYS extends string,
  PROPS extends string = any
> {
  /** the fetched feature flag values */
  flags: TFeatureFlags<KEYS> | undefined;
  /** whether the feature flags are loading */
  loading: boolean;
  /**
   * The function to identify the current user for the purpose of
   * fetching the correct feature flags. This is helpful if you
   * are segmenting flag rollouts for specific groups of users.
   */
  identify: TIdentifierFunction<PROPS>;
}

/**
 * The set of arguments needed to manage feature flag state
 * @typeParam KEYS the union of all possible feature flag keys.
 *   E.g. `'useV2ui' | 'useNewPaymentGateway' | ...`
 * @typeParam PROPS the union of all expected props on the user identifier object.
 *   E.g. `'organization' | 'email' | ...`
 */
export interface IUseFeatureFlagHookProps<
  KEYS extends string,
  PROPS extends string
> {
  /** the flag source to use to fetch the flag configuration */
  flagSource: IFeatureFlagSource<KEYS, PROPS>;
  /**
   * the key to use when caching the flag configuration to localStorage.
   * Defaults to {@link DefaultFeatureFlagCacheKey}
   */
  cacheKey?: string;
  /**
   * Whether or not to obfuscate (via base64 encoding) the cached key & feature
   * flags (and reduce the keys to only those that are true). This is useful
   * when you don't want people to be immediately aware of the keys that you
   * are using (or have available), but this is not a strong obfuscation as
   * it's only base64.
   */
  obfuscateCache?: boolean;
  /**
   * a list of the feature flag keys to auto-populate with false if not present
   * on the return value of the feature flag source
   */
  flagKeys?: KEYS[];
  /**
   * A list of values to watch and refetch the flags if changed, helpful if you
   * have non-identifier changes that trigger a flag change. Calls to
   * {@link IFeatureFlagContext.identify} will always trigger a refetch, so
   * there is no need to use this if you are already re-calling identify
   */
  refetchOnChange?: any[];
  /** Skip refetching temporarily while this prop is true */
  skip?: boolean;
  /**
   * The default values to use when any fetch operation fails if there is no cached
   * copy of the flags. The order of fallbacks (in case of error or not present) is as follows:
   * 1) `fetchFlags` result
   * 2) `localStorage` cache
   * 3) `defaultValues`
   */
  defaultValues?: TFeatureFlags<KEYS>;
}

/**
 * Defines a source of feature flags. This serves as an extensibility point
 * where anyone can implement their own flag source if they desire.
 * @typeParam KEYS the union of all possible feature flag keys.
 *   E.g. `'useV2ui' | 'useNewPaymentGateway' | ...`
 * @typeParam PROPS the union of all expected props on the user identifier object.
 *   E.g. `'organization' | 'email' | ...`
 */
export interface IFeatureFlagSource<
  KEYS extends string,
  PROPS extends string = string
> {
  /**
   * An initialization function that is called once upon initialization
   */
  init?(): Promise<void>;

  /**
   * Async function that fetches flags from a flag source
   * @param userInfo the props needed to identify a user enough to find the correct flags
   */
  fetchFlags(
    userInfo: TIdentifyParams<PROPS>
  ): Promise<TFeatureFlags<KEYS>> | TFeatureFlags<KEYS>;
}
