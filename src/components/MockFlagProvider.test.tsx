import React from 'react';
import { useFeatureFlagContext, useFeatureFlags } from '../hooks/hooks';
import { render } from '@testing-library/react';
import { MockFlagProvider } from './MockFlagProvider';

const flagKeys = ['test1', 'test2'] as const;

const MockProviderTestChild: React.FC = () => {
  const context = useFeatureFlagContext<typeof flagKeys[number], any>();
  const flags = useFeatureFlags<typeof flagKeys[number]>();
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

describe('MockProvider tests', () => {
  test('should mock loading correctly', () => {
    const res = render(
      <MockFlagProvider loading={true}>
        <MockProviderTestChild />
      </MockFlagProvider>
    );
    expect(res.getByTestId('loading-indicator')).toHaveTextContent(
      'loading:true'
    );
  });

  test('should mock flags correctly alternate true', () => {
    let res = render(
      <MockFlagProvider<typeof flagKeys[number]>
        loading={false}
        flags={{
          test1: true,
          test2: false,
        }}>
        <MockProviderTestChild />
      </MockFlagProvider>
    );
    expect(res.getByTestId('loading-indicator')).toHaveTextContent(
      'loading:false'
    );
    expect(res.getByTestId('test1')).toHaveTextContent('test1:true');
    expect(res.getByTestId('test2')).toHaveTextContent('test2:false');
    expect(res.getByTestId('test3')).toHaveTextContent('test3:undefined');
  });

  test('should mock flags correctly both true', () => {
    let res = render(
      <MockFlagProvider<typeof flagKeys[number]>
        loading={false}
        flags={{
          test1: true,
          test2: true,
        }}>
        <MockProviderTestChild />
      </MockFlagProvider>
    );
    expect(res.getByTestId('loading-indicator')).toHaveTextContent(
      'loading:false'
    );
    expect(res.getByTestId('test1')).toHaveTextContent('test1:true');
    expect(res.getByTestId('test2')).toHaveTextContent('test2:true');
    expect(res.getByTestId('test3')).toHaveTextContent('test3:undefined');
  });
});
