import util from 'util'
import fs from 'fs'

type SupportedExtensions = 'json' | 'yaml' | 'yml'

const supportedExtensions: SupportedExtensions[] = ['json', 'yaml', 'yml']

export async function readFileContent(path: string): Promise<{
  contents: string
  extension: string
}> {
  const extension = path.split('.').pop()

  if (
    !extension ||
    !supportedExtensions.includes(extension as SupportedExtensions)
  ) {
    throw new Error('File extension not supported')
  }

  const readFile = util.promisify(fs.readFile)
  const contents = await readFile(path, 'utf8')

  return { contents, extension }
}
