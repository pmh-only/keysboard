module.exports = {
  root: true,
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier',
    'standard-with-typescript'
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte']
  },
  rules: {
    '@typescript-eslint/no-throw-literal': 'off'
  }
}
