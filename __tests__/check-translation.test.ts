import { checkTranslation } from '../src/check-translations'
import { expect } from '@jest/globals'

describe('check translations', () => {
  it('should return true for matching translations', () => {
    const en = { home: 'Home' }
    const pl = { home: 'Strona główna' }

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [{ json: pl, filePath: 'pl.json' }]
    })

    expect(result.success).toBe(true)
  })

  it('should return false when translation is missing keys', () => {
    const en = { home: 'Home', about: 'About' }
    const pl = { home: 'Strona główna' }

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [{ json: pl, filePath: 'pl.json' }]
    })

    expect(result.success).toBe(false)
    expect(result.errors).toEqual([{ key: 'about', filePath: 'pl.json' }])
  })

  it('should handle nested objects correctly', () => {
    const en = {
      home: 'Home',
      about: { title: 'About', description: 'Description' }
    }
    const pl = {
      home: 'Strona główna',
      about: { title: 'O nas', description: 'Opis' }
    }

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [{ json: pl, filePath: 'pl.json' }]
    })

    expect(result.success).toBe(true)
  })

  it('should return false for mismatched nested objects', () => {
    const en = {
      home: 'Home',
      about: { required: 'I am required' }
    }
    const pl = {
      home: 'Strona główna',
      about: { im_not_required: 'I am not required' }
    }

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [{ json: pl, filePath: 'pl.json' }]
    })

    expect(result.success).toBe(false)
    expect(result.errors).toEqual([
      { key: 'about.required', filePath: 'pl.json' }
    ])
  })

  it('should parse deeply nested translations', () => {
    const en = {
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
    }
    const pl = {
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
    }

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [{ json: pl, filePath: 'pl.json' }]
    })

    expect(result.success).toBe(true)
  })

  it('should parse deeply nested translations and provide correct path for errors', () => {
    const en = {
      menu: {
        file: {
          new: 'New',
          open: 'Open',
          save: {
            label: 'Save',
            shortcut: 'Ctrl+S',
            find_me: 'Find me'
          }
        },
        edit: {
          cut: 'Cut',
          copy: 'Copy',
          paste: 'Paste'
        }
      }
    }
    const pl = {
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
    }

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [{ json: pl, filePath: 'pl.json' }]
    })

    expect(result.errors).toEqual([
      { key: 'menu.file.save.find_me', filePath: 'pl.json' }
    ])
  })

  it('should handle multiple translations', () => {
    const en = { hello: 'Hello', goodbye: 'Goodbye' }
    const pl = { hello: 'Cześć', goodbye: 'Do widzenia' }
    const es = { hello: 'Hola', goodbye: 'Adiós' }
    const fr = { hello: 'Bonjour', goodbye: 'Au revoir' }

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
    const en = { hello: 'Hello', goodbye: 'Goodbye' }
    const pl = { hello: 'Cześć', goodbye: 'Do widzenia' }
    const es = { hello: 'Hola' } // Missing 'goodbye'

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
    const en = {}
    const pl = {}

    const result = checkTranslation({
      mainTranslation: { json: en, filePath: 'en.json' },
      translations: [{ json: pl, filePath: 'pl.json' }]
    })

    expect(result.success).toBe(true)
  })
})
