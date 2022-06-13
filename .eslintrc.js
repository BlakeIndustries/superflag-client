module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jsdoc'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended',
  ],
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    'jsdoc/require-param': [
      'error' | 'warn',
      { checkDestructuredRoots: false },
    ],
    'jsdoc/require-jsdoc': [
      'error' | 'warn',
      { publicOnly: { ancestorsOnly: true } },
    ],
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns-type': 'off',
    'jsdoc/check-tag-names': 'off',
  },
};
