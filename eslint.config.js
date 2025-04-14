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
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'prefer-destructuring': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    },
  },
]
