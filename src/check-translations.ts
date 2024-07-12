type Error = {
  readonly key: string
}

function getPaths(obj: any, path: string, paths: string[]) {
  for (const key in obj) {
    const fullPath = `${path ? `${path}.` : ''}${key}`

    if (typeof obj[key] === 'object') {
      getPaths(obj[key], fullPath, paths)
    } else {
      paths.push(fullPath)
    }
  }
}

function comparePaths(first: string[], second: string[], errors: Error[] = []) {
  for (let i = 0; i < first.length; i++) {
    if (first[i] !== second[i]) {
      errors.push({ key: first[i] })

      return false
    }
  }

  return true
}

interface CheckTranslationsProps {
  readonly mainTranslation: string
  readonly translations: string[]
}

export function checkTranslation({
  mainTranslation,
  translations
}: CheckTranslationsProps) {
  const errors: Error[] = []

  const mainTranslationObj = JSON.parse(mainTranslation)
  const requiredPaths: string[] = []
  getPaths(mainTranslationObj, '', requiredPaths)

  for (const translation of translations) {
    const translationObj = JSON.parse(translation)

    const paths: string[] = []

    getPaths(translationObj, '', paths)
    comparePaths(requiredPaths, paths, errors)
  }

  if (errors.length) {
    for (const error of errors) {
      console.error(`key missing: ${error.key}`)
    }
    return false
  }

  return true
}
