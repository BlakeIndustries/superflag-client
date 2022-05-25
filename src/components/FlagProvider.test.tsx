import React, { useEffect } from 'react';
import { useFeatureFlagContext, useFeatureFlags } from '../hooks';
import { render, RenderResult, waitFor } from '@testing-library/react';
import { FlagProvider } from './FlagProvider';
import { TFeatureFlags } from '../types';
import { createDeferred, mockLocalStorage } from '../utils/helpers.util.test';
import { encodeBase64 } from '../utils/helpers';
import { DefaultFeatureFlagCacheKey } from '../constants';

const flagKeys = ['test1', 'test2'] as const;
type MockFlags = typeof flagKeys[number];
const flagKeysMutable = [...flagKeys];

const FlagProviderTestChild: React.FC = () => {
  const context = useFeatureFlagContext<MockFlags, any>();
  const flags = useFeatureFlags<MockFlags>();

  useEffect(() => {
    context.identify({ coreIdentifier: 'asd123' });
  }, []);

  return (
    <>
      <div data-testid="loading-indicator">loading:{context.loading + ''}</div>
      <div data-testid="test1">test1:{flags.test1 + ''}</div>
      <div data-testid="test2">test2:{flags.test2 + ''}</div>
      {/* @ts-ignore */}
      <div data-testid="test3">test3:{flags.test3 + ''}</div>
    </>
  );
};

describe('FlagProvider tests', () => {
  const mockSource = jest.fn();
  const localStorageSpy = mockLocalStorage();
  const mockFlagOneTrue = {
    test1: true,
    test2: false,
  };
  const mockFlagBothTrue = {
    test1: true,
    test2: true,
  };
  const mockFlagBothFalse = {
    test1: false,
    test2: false,
  };

  describe('on success', () => {
    test('should mock loading correctly with no cache', async () => {
      // setup
      const deferred = createDeferred<TFeatureFlags<MockFlags>>();
      mockSource.mockReturnValue(deferred.promise);
      const res = render(
        <FlagProvider flagSource={mockSource}>
          <FlagProviderTestChild />
        </FlagProvider>
      );
      verifyDisplayedValues(res, { loading: true });

      // run
      deferred.resolve(mockFlagOneTrue);
      await waitFor(() => res.getByText('loading:false'));

      // test
      verifyDisplayedValues(res, { loading: false, ...mockFlagOneTrue });
      expect(localStorageSpy.setItem).toHaveBeenCalledWith(
        DefaultFeatureFlagCacheKey,
        JSON.stringify(mockFlagOneTrue)
      );
    });

    test('should mock loading correctly with cache', async () => {
      // setup
      const deferred = createDeferred<TFeatureFlags<MockFlags>>();
      mockSource.mockReturnValue(deferred.promise);
      localStorageSpy.getItem.mockReturnValue(JSON.stringify(mockFlagBothTrue));

      // run
      const res = render(
        <FlagProvider flagSource={mockSource}>
          <FlagProviderTestChild />
        </FlagProvider>
      );
      verifyDisplayedValues(res, { loading: true, ...mockFlagBothTrue });

      deferred.resolve(mockFlagOneTrue);
      await waitFor(() => res.getByText('loading:false'));

      // test
      verifyDisplayedValues(res, { loading: false, ...mockFlagOneTrue });
    });

    test('should mock loading correctly with defaultValues', async () => {
      // setup
      const deferred = createDeferred<TFeatureFlags<MockFlags>>();
      mockSource.mockReturnValue(deferred.promise);

      // run
      const res = render(
        <FlagProvider flagSource={mockSource} defaultValues={mockFlagBothTrue}>
          <FlagProviderTestChild />
        </FlagProvider>
      );
      verifyDisplayedValues(res, { loading: true, ...mockFlagBothTrue });

      deferred.resolve(mockFlagOneTrue);
      await waitFor(() => res.getByText('loading:false'));

      // test
      verifyDisplayedValues(res, { loading: false, ...mockFlagOneTrue });
    });
  });

  describe('on source error', () => {
    describe('inline', () => {
      test('should handle when no default or cache', async () => {
        // setup
        mockSource.mockImplementation(() => {
          throw new Error('mock error');
        });

        // run
        const res = render(
          <FlagProvider flagSource={mockSource}>
            <FlagProviderTestChild />
          </FlagProvider>
        );

        // test
        verifyDisplayedValues(res, { loading: false });
      });

      test('should handle when cache present', async () => {
        // setup
        mockSource.mockImplementation(() => {
          throw new Error('mock error');
        });
        localStorageSpy.getItem.mockReturnValue(
          JSON.stringify(mockFlagOneTrue)
        );

        // run
        const res = render(
          <FlagProvider flagSource={mockSource}>
            <FlagProviderTestChild />
          </FlagProvider>
        );

        // test
        verifyDisplayedValues(res, { loading: false, ...mockFlagOneTrue });
      });

      test('should handle when default present', async () => {
        // setup
        mockSource.mockImplementation(() => {
          throw new Error('mock error');
        });

        // run
        const res = render(
          <FlagProvider flagSource={mockSource} defaultValues={mockFlagOneTrue}>
            <FlagProviderTestChild />
          </FlagProvider>
        );

        // test
        verifyDisplayedValues(res, { loading: false, ...mockFlagOneTrue });
      });
    });

    describe('async', () => {
      test('should handle when no default or cache', async () => {
        // setup
        const deferred = createDeferred<TFeatureFlags<MockFlags>>();
        mockSource.mockReturnValue(deferred.promise);
        const res = render(
          <FlagProvider flagSource={mockSource}>
            <FlagProviderTestChild />
          </FlagProvider>
        );
        verifyDisplayedValues(res, { loading: true });

        // run
        deferred.reject(new Error('mock error'));
        await waitFor(() => res.getByText('loading:false'));

        // test
        verifyDisplayedValues(res, { loading: false });
      });

      test('should handle when cache present', async () => {
        // setup
        const deferred = createDeferred<TFeatureFlags<MockFlags>>();
        mockSource.mockReturnValue(deferred.promise);
        localStorageSpy.getItem.mockReturnValue(
          JSON.stringify(mockFlagBothTrue)
        );

        // run
        const res = render(
          <FlagProvider flagSource={mockSource}>
            <FlagProviderTestChild />
          </FlagProvider>
        );
        verifyDisplayedValues(res, { loading: true, ...mockFlagBothTrue });

        deferred.reject(new Error('mock error'));
        await waitFor(() => res.getByText('loading:false'));

        // test
        verifyDisplayedValues(res, { loading: false, ...mockFlagBothTrue });
      });

      test('should handle when default present', async () => {
        // setup
        const deferred = createDeferred<TFeatureFlags<MockFlags>>();
        mockSource.mockReturnValue(deferred.promise);

        // run
        const res = render(
          <FlagProvider
            flagSource={mockSource}
            defaultValues={mockFlagBothTrue}>
            <FlagProviderTestChild />
          </FlagProvider>
        );
        verifyDisplayedValues(res, { loading: true, ...mockFlagBothTrue });

        deferred.reject(new Error('mock error'));
        await waitFor(() => res.getByText('loading:false'));

        // test
        verifyDisplayedValues(res, { loading: false, ...mockFlagBothTrue });
      });
    });
  });

  describe('obfuscate flags', () => {
    test('should obfuscate key and value and remove false flags', async () => {
      // setup
      const deferred = createDeferred<TFeatureFlags<MockFlags>>();
      mockSource.mockReturnValue(deferred.promise);

      // run
      const res = render(
        <FlagProvider flagSource={mockSource} obfuscateCache>
          <FlagProviderTestChild />
        </FlagProvider>
      );
      verifyDisplayedValues(res, { loading: true });

      deferred.resolve(mockFlagOneTrue);
      await waitFor(() => res.getByText('loading:false'));

      // test
      verifyDisplayedValues(res, {
        loading: false,
        ...mockFlagOneTrue,
      });

      expect(localStorageSpy.setItem).toHaveBeenCalledWith(
        encodeBase64(DefaultFeatureFlagCacheKey),
        encodeBase64(JSON.stringify({ test1: true }))
      );
    });

    test('should keep false flags when flagKeys is provided', async () => {
      // setup
      const deferred = createDeferred<TFeatureFlags<MockFlags>>();
      mockSource.mockReturnValue(deferred.promise);

      // run
      const res = render(
        <FlagProvider
          flagSource={mockSource}
          obfuscateCache
          flagKeys={flagKeysMutable}>
          <FlagProviderTestChild />
        </FlagProvider>
      );
      verifyDisplayedValues(res, { loading: true, ...mockFlagBothFalse });

      deferred.resolve(mockFlagOneTrue);
      await waitFor(() => res.getByText('loading:false'));

      // test
      verifyDisplayedValues(res, { loading: false, ...mockFlagOneTrue });

      expect(localStorageSpy.setItem).toHaveBeenCalledWith(
        encodeBase64(DefaultFeatureFlagCacheKey),
        encodeBase64(JSON.stringify({ test1: true }))
      );
    });
  });

  describe('refetch on change', () => {
    test('should refetch flags on change', async () => {
      // setup
      mockSource.mockResolvedValue(mockFlagOneTrue);

      // run
      const res = render(
        <FlagProvider flagSource={mockSource} refetchOnChange={[true]}>
          <FlagProviderTestChild />
        </FlagProvider>
      );

      await waitFor(() => res.getByText('loading:false'));
      verifyDisplayedValues(res, {
        loading: false,
        ...mockFlagOneTrue,
      });
      expect(mockSource).toBeCalledTimes(1);
      res.rerender(
        <FlagProvider flagSource={mockSource} refetchOnChange={[false]}>
          <FlagProviderTestChild />
        </FlagProvider>
      );

      // test
      expect(mockSource).toBeCalledTimes(2);
    });

    test('should keep false flags when flagKeys is provided', async () => {
      // setup
      const deferred = createDeferred<TFeatureFlags<MockFlags>>();
      mockSource.mockReturnValue(deferred.promise);

      // run
      const res = render(
        <FlagProvider
          flagSource={mockSource}
          obfuscateCache
          flagKeys={flagKeysMutable}>
          <FlagProviderTestChild />
        </FlagProvider>
      );
      verifyDisplayedValues(res, { loading: true, ...mockFlagBothFalse });

      deferred.resolve(mockFlagOneTrue);
      await waitFor(() => res.getByText('loading:false'));

      // test
      verifyDisplayedValues(res, { loading: false, ...mockFlagOneTrue });

      expect(localStorageSpy.setItem).toHaveBeenCalledWith(
        encodeBase64(DefaultFeatureFlagCacheKey),
        encodeBase64(JSON.stringify({ test1: true }))
      );
    });
  });

  test('should throw an error when identify is called before initializing', async () => {
    try {
      render(<FlagProviderTestChild />);
      fail();
    } catch (err: any) {
      expect(err.message).toContain('FlagProvider not initialized yet');
    }
  });

  function verifyDisplayedValues<Container>(
    res: RenderResult,
    expectedValues: Partial<TFeatureFlags<MockFlags>> & { loading: boolean }
  ) {
    expect(res.getByTestId('loading-indicator')).toHaveTextContent(
      `loading:${expectedValues.loading}`
    );
    expect(res.getByTestId('test1')).toHaveTextContent(
      `test1:${expectedValues.test1}`
    );
    expect(res.getByTestId('test2')).toHaveTextContent(
      `test2:${expectedValues.test2}`
    );
    expect(res.getByTestId('test3')).toHaveTextContent('test3:undefined');
  }
});
