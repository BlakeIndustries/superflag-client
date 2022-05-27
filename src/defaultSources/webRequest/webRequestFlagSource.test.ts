import { TFeatureFlags } from '../../types';
import axios, { AxiosRequestConfig } from 'axios';
import { WebRequestFlagSource } from './webRequestFlagSource';

jest.mock('axios');

describe('WebRequestFlagSource tests', () => {
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
    const source = new WebRequestFlagSource(requestArgs);

    expect(
      await source.fetchFlags({ coreIdentifier: 'asd@example.com' })
    ).toEqual(mockFlags);
    expect(axiosMock).toHaveBeenCalledWith(requestArgs);
  });
});
