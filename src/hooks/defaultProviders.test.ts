import { createConstantFlagSource } from './defaultProviders';
import { TFeatureFlags } from '../types';

describe('defaultProviders tests', () => {
  const mockFlags: TFeatureFlags<'test1' | 'test2'> = {
    test1: true,
    test2: false,
  };

  test('should always return the passed constant', async () => {
    let source = createConstantFlagSource(mockFlags);
    expect(await source({ coreIdentifier: 'asd@example.com' })).toEqual(
      mockFlags
    );
    expect(await source({ coreIdentifier: 'test123@example.com' })).toEqual(
      mockFlags
    );
    expect(await source({ coreIdentifier: 'test234@example.com' })).toEqual(
      mockFlags
    );
  });
});
