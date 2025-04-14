import { codeFrameColumns } from '@babel/code-frame'
import { readFileSync } from 'node:fs'
import * as EncodingType from '../EncodingType/EncodingType.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

const RE_MODULE_NOT_FOUND_STACK =
  /Cannot find package '([^']+)' imported from (.+)$/

export const prepareModuleNotFoundError = (error: any) => {
  const { message } = error
  const match = message.match(RE_MODULE_NOT_FOUND_STACK)
  if (!match) {
    return {
      message,
      stack: error.stack,
      codeFrame: '',
    }
  }
  const notFoundModule = match[1]
  const importedFrom = match[2]
  const rawLines = readFileSync(importedFrom, EncodingType.Utf8)
  let line = 0
  let column = 0
  const splittedLines = SplitLines.splitLines(rawLines)
  for (let i = 0; i < splittedLines.length; i++) {
    const splittedLine = splittedLines[i]
    const index = splittedLine.indexOf(notFoundModule)
    if (index !== -1) {
      line = i + 1
      column = index
      break
    }
  }
  const location = {
    start: {
      line,
      column,
    },
  }
  const codeFrame = codeFrameColumns(rawLines, location)
  const stackLines = SplitLines.splitLines(error.stack)
  const newStackLines = [
    stackLines[0],
    `    at ${importedFrom}:${line}:${column}`,
    ...stackLines.slice(1),
  ]
  const newStack = JoinLines.joinLines(newStackLines)
  return {
    message,
    stack: newStack,
    codeFrame,
  }
}
