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

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
  })

  it('gets the correct path', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'main_translation_path':
          return './src/locales/en.json'
        case 'translation_paths':
          return './src/locales/*.json'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(getInputMock).toHaveBeenNthCalledWith(1, 'main_translation_path')
    expect(getInputMock).toHaveBeenNthCalledWith(2, 'translation_paths')
  })
})
