export type TFeatureFlags<KEYS extends string> = Partial<Record<KEYS, boolean>>;

export type TIdentifyParams<PROPS extends string> = Record<
  PROPS,
  string | boolean | number | undefined
> & {
  coreIdentifier: string;
};

export type TIdentifierFunction<PROPS extends string = any> = (
  props: TIdentifyParams<PROPS>
) => void;

export interface IFeatureFlagContext<
  KEYS extends string,
  PROPS extends string = any
> {
  flags: TFeatureFlags<KEYS> | undefined;
  loading: boolean;
  identify: TIdentifierFunction<PROPS>;
}

export interface IUseFeatureFlagHookProps<
  KEYS extends string,
  PROPS extends string
> {
  flagSource: TFeatureFlagSource<KEYS, PROPS>;
  cacheKey?: string;
  obfuscateCache?: boolean;
  flagKeys?: KEYS[];
  refetchOnChange?: any[];
  skip?: boolean;
  defaultValues?: TFeatureFlags<KEYS>;
}

export type TFeatureFlagSource<KEYS extends string, PROPS extends string> = (
  props: TIdentifyParams<PROPS>
) => Promise<TFeatureFlags<KEYS>>;
