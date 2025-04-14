import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'

export class JsonParsingError extends Error {
  code: string
  codeFrame: any
  constructor(message: any, codeFrame: any, stack: any) {
    super(message)
    this.name = 'JsonParsingError'
    this.code = ErrorCodes.E_JSON_PARSE
    if (codeFrame) {
      this.codeFrame = codeFrame
    }

    if (stack) {
      const parentStack = JoinLines.joinLines(
        // @ts-ignore
        SplitLines.splitLines(this.stack).slice(1),
      )
      this.stack =
        this.name + ': ' + this.message + '\n' + stack + '\n' + parentStack
    }
  }
}
