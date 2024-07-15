type Error = {
  readonly key: string
}

function getPaths(
  obj: Record<string, unknown>,
  path: string,
  paths: string[]
): void {
  for (const key in obj) {
    const fullPath = `${path ? `${path}.` : ''}${key}`

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      getPaths(obj[key] as Record<string, unknown>, fullPath, paths)
    } else {
      paths.push(fullPath)
    }
  }
}

function comparePaths(
  first: string[],
  second: string[],
  errors: Error[] = []
): boolean {
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
}: CheckTranslationsProps): boolean {
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
