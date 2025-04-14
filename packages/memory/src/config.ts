import { join } from 'node:path'
import { root } from './root.ts'

export const instantiations = 400

export const instantiationsPath = join(root, 'packages', 'pretty-error')
