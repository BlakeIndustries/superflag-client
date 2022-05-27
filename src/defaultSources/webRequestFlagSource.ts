import { TFeatureFlagSource } from '../types';
import axios, { AxiosRequestConfig } from 'axios';

/**
 * creates a flag source for fetching the flag values from a url. The return
 * response is used directly by default, however the source supports passing
 * in any arguments supported by Axios.request(), including transformResponse.
 *
 * @param args the axios args to use when making the http request
 */
export const createWebRequestFlagSource = <KEYS extends string>(
  args: AxiosRequestConfig
): TFeatureFlagSource<KEYS, any> => {
  return async () => {
    const result = await axios.request(args);
    return result.data ?? {};
  };
};
