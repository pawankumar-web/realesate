import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const vitestGlobals = {
  describe: true,
  it: true,
  expect: true,
  beforeEach: true,
  afterEach: true,
  beforeAll: true,
  afterAll: true,
  vi: true,
}

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    files: ['src/tests/**/*.{ts,tsx}'],
    languageOptions: {
      globals: vitestGlobals,
    },
  },
])
