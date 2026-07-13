import config from '@lvce-editor/eslint-config'

export default [
  ...config,
  {
    ignores: [
      'packages/file-search-worker/src/fileSearchWorkerMain.ts',
      'packages/file-search-worker/test/GetJson.test.ts',
      'packages/file-search-worker/test/GetJson.test.ts',
    ],
  },
  {
    rules: {
      'package-json/sort-collections': 'off',
      'package-json/valid-description': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'prefer-destructuring': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'no-useless-escape': 'off',
      'unicorn/error-message': 'off',
      'jest/no-disabled-tests': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@cspell/spellchecker': 'off',
      'jest/no-restricted-jest-methods': 'off',
      'no-console': 'off',
      'perfectionist/sort-objects': 'off',
      'sonarjs/prefer-single-boolean-return': 'off',
      'sonarjs/super-linear-regex': 'off',
      'unicorn/no-error-property-assignment': 'off',
      'unicorn/prefer-boolean-return': 'off',
    },
  },
]
