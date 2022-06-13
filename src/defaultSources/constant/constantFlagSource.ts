import {
  IFeatureFlagSource,
  TFeatureFlags,
  TIdentifyParams,
} from '../../types';

export class ConstantFlagSource<KEYS extends string>
  implements IFeatureFlagSource<KEYS>
{
  // don't wait for init to be called
  fetchOnInit = true;

  /**
   * Constructs a basic flag source that returns a constant
   *
   * @param flags the flags to return
   */
  constructor(private flags: TFeatureFlags<KEYS>) {}

  fetchFlags(props: TIdentifyParams) {
    return this.flags;
  }
}
