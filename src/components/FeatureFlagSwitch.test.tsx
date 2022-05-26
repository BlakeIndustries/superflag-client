import React from 'react';
import { render } from '@testing-library/react';
import { MockFlagProvider } from './MockFlagProvider';
import { FeatureFlagSwitch } from './FeatureFlagSwitch';

const flagKeys = ['test1', 'test2'] as const;
type MockFlags = typeof flagKeys[number];
const flagKeysMutable = [...flagKeys];

describe('FeatureFlagSwitch tests', () => {
  test('should show contents when flag true', () => {
    // run
    const res = render(
      <MockFlagProvider flags={{ test1: true }}>
        <FeatureFlagSwitch<MockFlags>
          flagKey="test1"
          whenTrue={<span data-testid="contents-true">Should show this</span>}
          whenFalse={
            <span data-testid="contents-false">Should hide this</span>
          }></FeatureFlagSwitch>
      </MockFlagProvider>
    );

    // test
    expect(res.queryByTestId('contents-true')).toBeTruthy();
    expect(res.queryByTestId('contents-false')).not.toBeTruthy();
  });

  test('should show contents when flag false', () => {
    // run
    const res = render(
      <MockFlagProvider flags={{ test1: false }}>
        <FeatureFlagSwitch<MockFlags>
          flagKey="test1"
          whenTrue={<span data-testid="contents-true">Should show this</span>}
          whenFalse={
            <span data-testid="contents-false">Should hide this</span>
          }></FeatureFlagSwitch>
      </MockFlagProvider>
    );

    // test
    expect(res.queryByTestId('contents-false')).toBeTruthy();
    expect(res.queryByTestId('contents-true')).not.toBeTruthy();
  });
});
