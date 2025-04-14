// parsing error handling based on https://github.com/sindresorhus/parse-json/blob/main/index.js

import * as Character from '../Character/Character.ts'
import { JsonParsingError } from '../JsonParsingError/JsonParsingError.ts'

export const parse = async (string: string, filePath: string) => {
  try {
    return JSON.parse(string)
  } catch (error) {
    const JsonError = await import('../JsonError/JsonError.ts')
    const errorProps = JsonError.getErrorPropsFromError(error, string, filePath)
    throw new JsonParsingError(
      errorProps.message,
      errorProps.codeFrame,
      errorProps.stack,
    )
  }
}

export const stringify = (value: any) => {
  return JSON.stringify(value, null, 2) + Character.NewLine
}
