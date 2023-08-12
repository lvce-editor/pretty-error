import { cp, readFile, rm, writeFile } from 'node:fs/promises'
import path, { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dist = join(root, 'dist')

await rm(dist, { recursive: true, force: true })

await cp(join(root, 'src'), join(dist, 'src'), {
  recursive: true,
})

const readJson = async (path) => {
  const content = await readFile(path, 'utf8')
  return JSON.parse(content)
}

const writeJson = async (path, json) => {
  await writeFile(path, JSON.stringify(json, null, 2) + '\n')
}

const packageJson = await readJson(join(root, 'package.json'))

delete packageJson.script
delete packageJson.devDependencies
delete packageJson.prettier

await writeJson(join(dist, 'package.json'))
