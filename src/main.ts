import * as core from '@actions/core'
import { readFileContent } from './read-file-contents'
import { checkTranslation, Translation } from './check-translations'
import { convertToJson } from './convert-to-json'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  const mainTranslationPath = core.getInput('main_translation_path')
  const translationPaths = core
    .getInput('translation_paths')
    .split(',')
    .filter(Boolean)
    .map(s => s.trim())

  const [mainTranslation, ...translations]: Translation[] = await Promise.all(
    [mainTranslationPath, ...translationPaths].map(async filePath => {
      const file = await readFileContent(filePath)
      const json = await convertToJson(file)

      return {
        json,
        filePath
      }
    })
  )

  core.info('Checking translations...')

  const { errors } = checkTranslation({
    mainTranslation,
    translations
  })

  for (const error of errors) {
    core.error(
      `Missing translation for key - '${error.key}' for file '${error.filePath}'.`
    )
  }

  if (errors.length) {
    core.setFailed('Action failed because translations are missing.')
    return
  }

  core.info('No translations missing.')
}
