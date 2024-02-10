import { codeFrameColumns } from '@babel/code-frame'
import { LinesAndColumns } from 'lines-and-columns'
import { readFileSync } from 'node:fs'
import * as CleanStack from '../CleanStack/CleanStack.js'
import * as EncodingType from '../EncodingType/EncodingType.js'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.js'
import * as GetActualPath from '../GetActualPath/GetActualPath.js'
import * as JoinLines from '../JoinLines/JoinLines.js'
import * as Json from '../Json/Json.js'
import * as Logger from '../Logger/Logger.js'
import * as PrepareModuleNotFoundError from '../PrepareModuleNotFoundError/PrepareModuleNotFoundError.js'

export const prepare = (error) => {
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

const fixBackslashes = (string) => {
  return string.replaceAll('\\\\', '\\')
}

export const prepareJsonError = (json, property, message) => {
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
    jsonError.codeFrame = codeFrame
  }
  // jsonError.stack = `${bottomMessage}\n    at ${filePath}`
  return jsonError
}
