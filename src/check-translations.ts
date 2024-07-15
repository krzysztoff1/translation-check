export type Translation = {
  filePath: string
  json: string
}

type Error = {
  readonly key: string
  readonly filePath: string
}

interface GetPathsProps {
  obj: Record<string, unknown>
  path: string
  paths: string[]
}

function getPaths({ obj, path, paths }: GetPathsProps): void {
  for (const key in obj) {
    path = `${path ? `${path}.` : ''}${key}`

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      getPaths({
        obj: obj[key] as Record<string, unknown>,
        path,
        paths
      })
    } else {
      paths.push(path)
    }
  }
}

interface ComparePathsProps {
  requiredPaths: string[]
  paths: string[]
  errors: Error[]
  filePath: string
}

function comparePaths({
  requiredPaths,
  paths,
  errors,
  filePath
}: ComparePathsProps): boolean {
  for (let i = 0; i < requiredPaths.length; i++) {
    if (requiredPaths[i] !== paths[i]) {
      errors.push({ key: requiredPaths[i], filePath })

      return false
    }
  }

  return true
}

interface CheckTranslationsProps {
  readonly mainTranslation: Translation
  readonly translations: Translation[]
}

export function checkTranslation({
  mainTranslation,
  translations
}: CheckTranslationsProps): {
  readonly errors: Error[]
  readonly success: boolean
} {
  const errors: Error[] = []

  const requiredPaths: string[] = []
  getPaths({
    obj: JSON.parse(mainTranslation.json),
    path: '',
    paths: requiredPaths
  })

  for (const { filePath, json } of translations) {
    const paths: string[] = []

    getPaths({
      obj: JSON.parse(json),
      path: '',
      paths
    })

    comparePaths({ requiredPaths, paths, errors, filePath })
  }

  return {
    success: errors.length === 0,
    errors
  }
}
