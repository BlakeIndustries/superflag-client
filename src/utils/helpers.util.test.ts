type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
};

export function createDeferred<T>(): Deferred<T> {
  const result: Deferred<T> = {} as any;
  result.promise = new Promise<T>((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  })
    // trigger the processing
    .then((result) => result);

  return result;
}

export function mockLocalStorage() {
  const mock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
    removeItem: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', { value: mock });
  return mock;
}
