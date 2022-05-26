import { TFeatureFlagSource } from '../types';
import axios, { AxiosRequestConfig } from 'axios';

export const createStaticWebRequestFlagSource = <KEYS extends string>(
  args: AxiosRequestConfig
): TFeatureFlagSource<KEYS, any> => {
  return async () => {
    const result = await axios.request(args);
    return result.data ?? {};
  };
};
