import * as core from '@actions/core'
import { readFileContent } from './read-file-contents'
import { checkTranslation, Translation } from './check-translations'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const mainTranslationPath = core.getInput('main_translation_path')
    const translationPaths = core
      .getInput('translation_paths')
      .split(',')
      .map(s => s.trim())

    const [mainTranslation, ...translations]: Translation[] = await Promise.all(
      [mainTranslationPath, ...translationPaths].map(async filePath => ({
        json: await readFileContent(filePath),
        filePath
      }))
    )

    core.info('Checking translations...')

    const { errors } = checkTranslation({
      mainTranslation,
      translations
    })

    for (const error of errors) {
      core.error(
        `Missing translation for key - \`${error.key}\` for file \`${error.filePath}\`.`
      )
    }

    if (errors.length) {
      core.setFailed('Action failed because translations are missing')
    } else {
      core.info('No translations missing.')
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}
