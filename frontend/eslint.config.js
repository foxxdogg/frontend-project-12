import { FlatCompat } from '@eslint/eslintrc'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

const compat = new FlatCompat({ baseDir: new URL('.', import.meta.url).pathname })

export default [
  // Игнорируем папки
  {
    ignores: ['node_modules/', 'dist/', 'build/'],
  },

  // AirBnB + React + React Hooks через FlatCompat
  ...compat.extends('airbnb', 'plugin:react/recommended', 'plugin:react-hooks/recommended'),

  // Настройка плагинов и глобальных переменных
  {
    plugins: {
      import: importPlugin,
      'jsx-a11y': jsxA11y,
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

  // Специфические файлы
  {
    files: ['eslint.config.js', 'vite.config.js'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },

  // Правила проекта
  {
    rules: {
      semi: ['error', 'never'], // точки с запятой отключены
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/prefer-default-export': 'off',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'no-console': 'off',
      'quote-props': ['error', 'as-needed'], // кавычки только если нужно
    },
  },
]
