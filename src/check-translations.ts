export type Translation = {
  filePath: string
  json: JsonObject
}

type Error = {
  readonly key: string
  readonly filePath: string
}

export type JsonObject = { [key: string]: JsonValue }

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[]

function deepCompare(
  main: JsonObject,
  translation: JsonObject,
  path: string,
  errors: Error[],
  filePath: string
): void {
  for (const key in main) {
    const newPath = path ? `${path}.${key}` : key

    if (!(key in translation)) {
      errors.push({ key: newPath, filePath })
      continue
    }

    if (
      typeof main[key] === 'object' &&
      main[key] !== null &&
      typeof translation[key] === 'object' &&
      translation[key] !== null &&
      !Array.isArray(main[key]) &&
      !Array.isArray(translation[key])
    ) {
      deepCompare(main[key], translation[key], newPath, errors, filePath)
    }
  }
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
  const mainObj = mainTranslation.json

  for (const { filePath, json } of translations) {
    deepCompare(mainObj, json, '', errors, filePath)
  }

  return {
    success: errors.length === 0,
    errors
  }
}
