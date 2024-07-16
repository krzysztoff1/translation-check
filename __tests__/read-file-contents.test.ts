import { readFileContent } from '../src/read-file-contents'

it('reads file contents', async () => {
  const contents = await readFileContent('example-translations/en.json')

  expect(JSON.parse(contents)).toEqual({
    index: {
      title: 'Hello, World!',
      description:
        'This is a simple example of how to use translations in your project.'
    }
  })
})

it('throws an error when file does not exist', async () => {
  await expect(
    readFileContent('example-translations/does-not-exist.json')
  ).rejects.toThrow()
})
