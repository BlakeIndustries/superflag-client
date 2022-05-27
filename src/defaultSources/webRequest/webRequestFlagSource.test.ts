import { TFeatureFlags } from '../../types';
import axios, { AxiosRequestConfig } from 'axios';
import { createWebRequestFlagSource } from './webRequestFlagSource';

jest.mock('axios');

describe('staticWebRequestFlagSource tests', () => {
  let axiosMock: jest.Mock;
  const mockFlags: TFeatureFlags<'test1' | 'test2'> = {
    test1: true,
    test2: false,
  };

  beforeAll(() => {
    axiosMock = axios.request as any as jest.Mock;
  });

  test('should pass along request props directly', async () => {
    // setup
    axiosMock.mockResolvedValue({ data: mockFlags });
    const requestArgs: AxiosRequestConfig = {
      url: 'http://google.com',
      method: 'GET',
      transformResponse: (data) => data,
    };
    const source = createWebRequestFlagSource(requestArgs);

    expect(await source({ coreIdentifier: 'asd@example.com' })).toEqual(
      mockFlags
    );
    expect(axiosMock).toHaveBeenCalledWith(requestArgs);
  });
});
