import { fileURLToPath } from 'node:url'

export const getActualPath = (fileUri: string) => {
  if (fileUri.startsWith('file://')) {
    return fileURLToPath(fileUri)
  }
  return fileUri
}
