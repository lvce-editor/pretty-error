import { codeFrameColumns } from '@babel/code-frame'
import { LinesAndColumns } from 'lines-and-columns'
import { readFileSync } from 'node:fs'
import * as CleanStack from '../CleanStack/CleanStack.ts'
import * as EncodingType from '../EncodingType/EncodingType.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as GetActualPath from '../GetActualPath/GetActualPath.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'
import * as Json from '../Json/Json.ts'
import * as Logger from '../Logger/Logger.ts'
import * as PrepareModuleNotFoundError from '../PrepareModuleNotFoundError/PrepareModuleNotFoundError.ts'

export const prepare = (error: any) => {
  try {
    if (error && error.code === ErrorCodes.ERR_MODULE_NOT_FOUND) {
      return PrepareModuleNotFoundError.prepareModuleNotFoundError(error)
    }
    const { message } = error
    if (error && error.cause && typeof error.cause === 'function') {
      const cause = error.cause()
      if (cause) {
        error = cause
      }
    }
    const lines = CleanStack.cleanStack(error.stack)
    const file = lines[0]
    let codeFrame = ''
    if (error.codeFrame) {
      codeFrame = error.codeFrame
    } else if (file) {
      let match = file.match(/\((.*):(\d+):(\d+)\)$/)
      if (!match) {
        match = file.match(/at (.*):(\d+):(\d+)$/)
      }
      if (match) {
        const [_, path, line, column] = match
        const actualPath = GetActualPath.getActualPath(path)
        const rawLines = readFileSync(actualPath, EncodingType.Utf8)
        const location = {
          start: {
            line: Number.parseInt(line),
            column: Number.parseInt(column),
          },
        }
        codeFrame = codeFrameColumns(rawLines, location)
      }
    }
    const relevantStack = JoinLines.joinLines(lines)
    return {
      message,
      stack: relevantStack,
      codeFrame,
      type: error.constructor.name,
      code: error.code,
    }
  } catch (otherError) {
    Logger.warn(`ErrorHandling Error: ${otherError}`)
    return error
  }
}

const fixBackslashes = (string: string): string => {
  return string.replaceAll('\\\\', '\\')
}

export const prepareJsonError = (json: any, property: any, message: any) => {
  const string = fixBackslashes(Json.stringify(json))
  const stringifiedPropertyName = `"${property}"`
  const index = string.indexOf(stringifiedPropertyName) // TODO this could be wrong in some cases, find a better way
  console.log({ string, index })
  const jsonError = {
    stack: '',
  }
  if (index !== -1) {
    const lines = new LinesAndColumns(string)
    const location = lines.locationForIndex(
      index + stringifiedPropertyName.length + 1,
    )
    const codeFrame = codeFrameColumns(string, {
      // @ts-ignore
      start: { line: location.line + 1, column: location.column + 1 },
    })
    // @ts-ignore
    jsonError.codeFrame = codeFrame
  }
  // jsonError.stack = `${bottomMessage}\n    at ${filePath}`
  return jsonError
}
