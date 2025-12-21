import { FlatCompat } from '@eslint/eslintrc'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

const compat = new FlatCompat({ baseDir: process.cwd() })

export default [
  { ignores: ['node_modules/', 'dist/', 'build/'] },

  {
    plugins: {
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      '@stylistic': stylistic,
    },

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  ...compat.extends('airbnb', 'plugin:react/recommended', 'plugin:react-hooks/recommended'),

  {
    rules: {
      /* 🔥 КЛЮЧЕВОЕ */
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/jsx-one-expression-per-line': 'error',

      semi: ['error', 'never'],

      /* отключаем лишнее */
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/prefer-default-export': 'off',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'no-console': 'off',
    },
  },
]
