import { expect, test } from '@jest/globals'
import * as PrettyError from '../src/parts/PrettyError/PrettyError.ts'

test('prepare preserves an error name when the constructor is Error', () => {
  const error = new Error('setting has an invalid type')
  Object.defineProperties(error, {
    name: { value: 'TypeError' },
    stack: {
      value:
        'TypeError: setting has an invalid type\n    at test (test.js:1:1)',
    },
  })
  // @ts-ignore
  error.codeFrame = 'setting has an invalid type'

  expect(PrettyError.prepare(error)).toMatchObject({
    message: 'setting has an invalid type',
    type: 'TypeError',
  })
})
