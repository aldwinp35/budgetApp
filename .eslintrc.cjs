module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb', 'prettier', 'plugin:react/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'react/jsx-no-bind': 'off',
    'react/no-array-index-key': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/interactive-supports-focus': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-autofocus': 'off',

    'no-unused-vars': 'warn',
    'no-console': 'off',
    'no-alert': 'off',
    'no-restricted-globals': 'off',
    'no-process-exit': 'off',

    'func-names': 'off',
    'object-shorthand': 'off',
    'class-methods-use-this': 'off',
  },
};
