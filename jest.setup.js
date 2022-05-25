// this file is needed to do any common setup/teardown across all jest tests
require('@testing-library/jest-dom');
const { Logger } = require('./src/utils/logger');

beforeEach(() => {
  jest.resetAllMocks();
  Logger.instance = {
    error: jest.fn(),
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
});
