import { TFeatureFlags } from '../../types';
import * as LDClient from 'launchdarkly-js-client-sdk';
import { createLaunchDarklyFlagSource } from './launchDarklyFlagSource';

jest.mock('launchdarkly-js-client-sdk');

describe('launchDarklyFlagSource tests', () => {
  let clientInitMock: jest.Mock;
  const clientMock = {
    allFlags: jest.fn(),
    waitUntilReady: jest.fn(),
  };
  const mockFlags: TFeatureFlags<'test1' | 'test2'> = {
    test1: true,
    test2: false,
  };

  beforeEach(() => {
    clientInitMock = LDClient.initialize as any as jest.Mock;
    clientInitMock.mockReturnValue(clientMock);
    clientMock.waitUntilReady.mockReturnValue(Promise.resolve());
  });

  test('should pass along init props directly', async () => {
    // setup
    clientMock.allFlags.mockReturnValue(mockFlags);
    const clientId = 'asd123';
    const mockUser = { coreIdentifier: 'asd@example.com', key: 'sdf234' };
    const source = createLaunchDarklyFlagSource(clientId);

    // run
    expect(await source(mockUser)).toEqual(mockFlags);

    // test
    expect(clientInitMock).toHaveBeenCalledWith(clientId, mockUser);
    expect(clientMock.waitUntilReady).toHaveBeenCalledTimes(1);
    expect(clientMock.allFlags).toHaveBeenCalledTimes(1);
  });
});
