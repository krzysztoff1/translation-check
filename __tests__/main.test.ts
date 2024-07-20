/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

const runMock = jest.spyOn(main, 'run')

let getInputMock: jest.SpiedFunction<typeof core.getInput>
let errorMock: jest.SpiedFunction<typeof core.error>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let infoMock: jest.SpiedFunction<typeof core.info>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    infoMock = jest.spyOn(core, 'info').mockImplementation()
  })

  it('gets the correct path', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'main_translation_path':
          return 'example-translations/en.json'
        case 'translation_paths':
          return 'example-translations/pl.json'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(getInputMock).toHaveBeenNthCalledWith(1, 'main_translation_path')
    expect(getInputMock).toHaveBeenNthCalledWith(2, 'translation_paths')
  })

  it('displays an no missing translations message', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'main_translation_path':
          return 'example-translations/en.json'
        case 'translation_paths':
          return 'example-translations/pl.json'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(infoMock).toHaveBeenCalledTimes(2)
    expect(infoMock).toHaveBeenNthCalledWith(1, 'Checking translations...')
    expect(infoMock).toHaveBeenNthCalledWith(2, 'No translations missing.')
    expect(errorMock).not.toHaveBeenCalled()
    expect(setFailedMock).not.toHaveBeenCalled()
  })

  it('displays an error message for missing translations', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'main_translation_path':
          return 'example-translations/en.json'
        case 'translation_paths':
          return 'example-translations/pl-missing.json'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(infoMock).toHaveBeenCalledTimes(1)
    expect(infoMock).toHaveBeenNthCalledWith(1, 'Checking translations...')
    expect(errorMock).toHaveBeenCalledTimes(1)
    expect(errorMock).toHaveBeenCalledWith(
      `Missing translation for key - 'index.description' for file 'example-translations/pl-missing.json'.`
    )
    expect(setFailedMock).toHaveBeenCalledWith(
      'Action failed because translations are missing.'
    )
  })

  it('check the translation in yaml file', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'main_translation_path':
          return 'example-translations/en.yaml'
        case 'translation_paths':
          return 'example-translations/pl.yaml'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(infoMock).toHaveBeenCalledTimes(2)
    expect(infoMock).toHaveBeenNthCalledWith(1, 'Checking translations...')
    expect(infoMock).toHaveBeenNthCalledWith(2, 'No translations missing.')
    expect(errorMock).not.toHaveBeenCalled()
    expect(setFailedMock).not.toHaveBeenCalled()
  })

  it('displays an error message for missing translations in yaml file', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'main_translation_path':
          return 'example-translations/en.yaml'
        case 'translation_paths':
          return 'example-translations/pl-missing.yaml'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(infoMock).toHaveBeenCalledTimes(1)
    expect(infoMock).toHaveBeenNthCalledWith(1, 'Checking translations...')
    expect(errorMock).toHaveBeenCalledTimes(1)
    expect(errorMock).toHaveBeenCalledWith(
      `Missing translation for key - 'index.description' for file 'example-translations/pl-missing.yaml'.`
    )
    expect(setFailedMock).toHaveBeenCalledWith(
      'Action failed because translations are missing.'
    )
  })
})
