import React from 'react';
import { render } from '@testing-library/react';
import { MockFlagProvider } from './MockFlagProvider';
import { FeatureFlagGate } from './FeatureFlagGate';

const flagKeys = ['test1', 'test2'] as const;
type MockFlags = typeof flagKeys[number];
const flagKeysMutable = [...flagKeys];

describe('FeatureFlagGate tests', () => {
  test('should show contents when flag true', () => {
    // run
    const res = render(
      <MockFlagProvider flags={{ test1: true }}>
        <FeatureFlagGate<MockFlags> flagKey="test1">
          <span data-testid="contents">Should show this</span>
        </FeatureFlagGate>
      </MockFlagProvider>
    );

    // test
    expect(res.queryByTestId('contents')).toBeTruthy();
  });

  test('should hide contents when flag false', () => {
    // run
    const res = render(
      <MockFlagProvider flags={{ test1: false }}>
        <FeatureFlagGate<MockFlags> flagKey="test1">
          <span data-testid="contents">Should hide this</span>
        </FeatureFlagGate>
      </MockFlagProvider>
    );

    // test
    expect(res.queryByTestId('contents')).not.toBeTruthy();
  });
});
