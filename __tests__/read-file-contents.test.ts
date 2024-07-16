import { readFileContent } from '../src/read-file-contents'

describe('readFileContent', () => {
  it('reads json file contents', async () => {
    const { contents } = await readFileContent('example-translations/en.json')

    expect(JSON.parse(contents)).toEqual({
      index: {
        title: 'Hello, World!',
        description:
          'This is a simple example of how to use translations in your project.'
      }
    })
  })

  it('reads yaml file contents', async () => {
    const { contents } = await readFileContent('example-translations/en.yaml')

    expect(contents).toEqual(
      'index:\n  title: "Hello, World!"\n  description: "This is a simple example of how to use translations in your project."\n'
    )
  })

  it('throws an error when file does not exist', async () => {
    await expect(
      readFileContent('example-translations/does-not-exist.json')
    ).rejects.toThrow()
  })

  it('throws an error when file extension is not supported', async () => {
    await expect(
      readFileContent('example-translations/en.txt')
    ).rejects.toThrow()
  })

  it('throws an error when file extension is not found', async () => {
    await expect(readFileContent('example-translations/en')).rejects.toThrow()
  })
})
