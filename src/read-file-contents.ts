import util from 'util'
import fs from 'fs'

export async function readFileContent(path: string): Promise<string> {
  const readFile = util.promisify(fs.readFile)
  const contents = await readFile(path, 'utf8')
  return contents
}
