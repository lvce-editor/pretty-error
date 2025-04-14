export interface PrettyError {
  readonly message: string
  readonly stack: string
  readonly codeFrame: string
  readonly type?: string
  readonly code?: string
}

export const prepare: (error: Error) => Error | PrettyError

export interface JsonError {
  readonly codeFrame?: string
}

export const prepareJsonError: (
  json: any,
  property: string,
  message: string,
) => JsonError
