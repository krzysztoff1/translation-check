import { checkTranslation } from '../src/check-translations'
import { expect } from '@jest/globals'

describe('checkTranslation', () => {
  it('should return true for matching translations', () => {
    const en = JSON.stringify({ home: 'Home' })
    const pl = JSON.stringify({ home: 'Strona główna' })

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [{ json: pl, filePath: 'pl.json' }]
    })

    expect(result.success).toBe(true)
  })

  it('should return false when translation is missing keys', () => {
    const en = JSON.stringify({ home: 'Home', about: 'About' })
    const pl = JSON.stringify({ home: 'Strona główna' })

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [{ json: pl, filePath: 'pl.json' }]
    })

    expect(result.success).toBe(false)
  })

  it('should handle nested objects correctly', () => {
    const en = JSON.stringify({
      home: 'Home',
      about: { title: 'About', description: 'Description' }
    })
    const pl = JSON.stringify({
      home: 'Strona główna',
      about: { title: 'O nas', description: 'Opis' }
    })

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [{ json: pl, filePath: 'pl.json' }]
    })

    expect(result.success).toBe(true)
  })

  it('should return false for mismatched nested objects', () => {
    const en = JSON.stringify({
      home: 'Home',
      about: { required: 'I am required' }
    })
    const pl = JSON.stringify({
      home: 'Strona główna',
      about: { im_not_required: 'I am not required' }
    })

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [{ json: pl, filePath: 'pl.json' }]
    })

    expect(result.success).toBe(false)
  })

  it('should parse deeply nested translations', () => {
    const en = JSON.stringify({
      menu: {
        file: {
          new: 'New',
          open: 'Open',
          save: {
            label: 'Save',
            shortcut: 'Ctrl+S'
          }
        },
        edit: {
          cut: 'Cut',
          copy: 'Copy',
          paste: 'Paste'
        }
      }
    })
    const pl = JSON.stringify({
      menu: {
        file: {
          new: 'Nowy',
          open: 'Otwórz',
          save: {
            label: 'Zapisz',
            shortcut: 'Ctrl+S'
          }
        },
        edit: {
          cut: 'Wytnij',
          copy: 'Kopiuj',
          paste: 'Wklej'
        }
      }
    })

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [{ json: pl, filePath: 'pl.json' }]
    })

    expect(result.success).toBe(true)
  })

  it('should handle multiple translations', () => {
    const en = JSON.stringify({ hello: 'Hello', goodbye: 'Goodbye' })
    const pl = JSON.stringify({ hello: 'Cześć', goodbye: 'Do widzenia' })
    const es = JSON.stringify({ hello: 'Hola', goodbye: 'Adiós' })
    const fr = JSON.stringify({ hello: 'Bonjour', goodbye: 'Au revoir' })

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [
        { json: pl, filePath: 'pl.json' },
        { json: es, filePath: 'es.json' },
        { json: fr, filePath: 'fr.json' }
      ]
    })

    expect(result.success).toBe(true)
  })

  it('should return false if any translation is invalid', () => {
    const en = JSON.stringify({ hello: 'Hello', goodbye: 'Goodbye' })
    const pl = JSON.stringify({ hello: 'Cześć', goodbye: 'Do widzenia' })
    const es = JSON.stringify({ hello: 'Hola' }) // Missing 'goodbye'

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [
        { json: pl, filePath: 'pl.json' },
        { json: es, filePath: 'es.json' }
      ]
    })

    expect(result.success).toBe(false)
  })

  it('should handle empty objects', () => {
    const en = JSON.stringify({})
    const pl = JSON.stringify({})

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [{ json: pl, filePath: 'pl.json' }]
    })

    expect(result.success).toBe(true)
  })
})
