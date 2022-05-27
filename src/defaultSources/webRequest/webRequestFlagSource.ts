import {
  IFeatureFlagSource,
  TFeatureFlags,
  TIdentifyParams,
} from '../../types';
import axios, { AxiosRequestConfig } from 'axios';

export class WebRequestFlagSource<KEYS extends string>
  implements IFeatureFlagSource<KEYS>
{
  /**
   * creates a flag source for fetching the flag values from a url. The return
   * response is used directly by default, however the source supports passing
   * in any arguments supported by Axios.request(), including transformResponse.
   *
   * @param args the axios args to use when making the http request
   */
  constructor(private args: AxiosRequestConfig) {}

  async fetchFlags(props: TIdentifyParams) {
    const result = await axios.request(this.args);
    return result.data ?? {};
  }
}
