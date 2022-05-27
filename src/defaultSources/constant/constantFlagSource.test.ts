import { ConstantFlagSource } from './constantFlagSource';
import { TFeatureFlags } from '../../types';

describe('constantFlagSource tests', () => {
  const mockFlags: TFeatureFlags<'test1' | 'test2'> = {
    test1: true,
    test2: false,
  };

  test('should always return the passed constant', async () => {
    const source = new ConstantFlagSource(mockFlags);
    expect(
      await source.fetchFlags({ coreIdentifier: 'asd@example.com' })
    ).toEqual(mockFlags);
    expect(
      await source.fetchFlags({ coreIdentifier: 'test123@example.com' })
    ).toEqual(mockFlags);
    expect(
      await source.fetchFlags({ coreIdentifier: 'test234@example.com' })
    ).toEqual(mockFlags);
  });
});
