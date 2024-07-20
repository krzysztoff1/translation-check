# Translation Check Action

[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

Simple GitHub Action to check if all keys in the main translation file are
present in other translation files.

## Inputs

### `main_translation_path`

**Required** The path to the main translation file (typically the English
version). Default: `'./src/locales/en.json'`

### `translation_paths`

**Required** Comma-separated paths to the secondary translation files. Default:
`'./src/locales/pl.json'`

## Supported Formats

- JSON: `.json`
- YAML: `.yml` or `.yaml`

## Usage

To integrate this action into your workflow, add the following step:

```yaml
- name: Check Translations
  uses: krzysztoff1/translation-check@v1.1.0
  with:
    main_translation_path: './src/locales/en.json'
    translation_paths: './src/locales/fr.json,./src/locales/de.yml,./src/locales/es.yaml'
```

## Example

```yaml
name: Translation Check

on:
  push:
    paths:
      - 'src/locales/**'
  pull_request:
    paths:
      - 'src/locales/**'

jobs:
  check-translations:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Check Translations
        uses: krzysztoff1/translation-check@v1.1.0
        with:
          main_translation_path: './src/locales/en.json'
          translation_paths: './src/locales/fr.json,./src/locales/de.json,./src/locales/es.json'
```
