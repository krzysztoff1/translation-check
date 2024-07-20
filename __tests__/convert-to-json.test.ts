import { describe } from '@jest/globals'
import { convertToJson } from '../src/convert-to-json'

describe('convertToJson', () => {
  it('converts yaml to json', async () => {
    const yaml = `
index:
    title: Hello, World!
    description: This is a simple example of how to use translations in your project.
    `
    const json = await convertToJson({ contents: yaml, extension: 'yaml' })

    expect(json).toEqual({
      index: {
        title: 'Hello, World!',
        description:
          'This is a simple example of how to use translations in your project.'
      }
    })
  })

  it('throws an error when file extension is not supported', async () => {
    await expect(
      convertToJson({ contents: '', extension: 'lol' })
    ).rejects.toThrow()
  })
})
