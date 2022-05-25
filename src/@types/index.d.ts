import { FunctionComponent, PropsWithChildren } from 'react';

declare module 'react' {
  /** a function component with props */
  type FC<P = {}> = FunctionComponent<PropsWithChildren<P>>;
}
