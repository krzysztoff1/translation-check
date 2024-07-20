import { JsonObject } from './check-translations'
import yaml from 'js-yaml'

async function convertYamlToJson(contents: string): Promise<JsonObject> {
  return yaml.load(contents) as JsonObject
}

export async function convertToJson({
  contents,
  extension
}: {
  contents: string
  extension: string
}): Promise<JsonObject> {
  switch (extension) {
    case 'json':
      return JSON.parse(contents)
    case 'yaml':
    case 'yml':
      return await convertYamlToJson(contents)
    default:
      throw new Error('File extension not supported')
  }
}
