import * as Character from '../Character/Character.ts'

export const splitLines = (lines: string): readonly string[] => {
  return lines.split(Character.NewLine)
}
