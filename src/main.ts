import * as core from '@actions/core'
import { readFileContent } from './read-file-contents'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const mainTranslationPath = core.getInput('main_translation_path')
    const translationPaths = core.getInput('translation_paths').split(',')

    const [mainTranslation, ...translations] = await Promise.all(
      [mainTranslationPath, ...translationPaths].map(readFileContent)
    )

    console.log('mainTranslation', mainTranslation)
    console.log('translations', translations.join('\n'))

    core.info('Checking translations...')
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}
