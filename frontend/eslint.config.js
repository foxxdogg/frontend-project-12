import { FlatCompat } from '@eslint/eslintrc'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

const compat = new FlatCompat({
  baseDir: new URL('.', import.meta.url).pathname,
})

export default [
  // Игнорируем стандартные папки
  {
    ignores: ['node_modules/', 'dist/', 'build/'],
  },

  // Наследуем правила AirBnB, React и React-Hooks
  ...compat.extends(
    'airbnb',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ),

  // Настройки плагинов
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

  // Файлы конфигов
  {
    files: ['eslint.config.js', 'vite.config.js'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },

  // Основные правила проекта
  {
    rules: {
      semi: ['error', 'never'],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/prefer-default-export': 'off',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'no-console': 'off',
      'max-len': ['error', { code: 125, ignoreUrls: true }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // игнорируем переменные, начинающиеся с _
      'no-param-reassign': [
        'error',
        { props: true, ignorePropertyModificationsFor: ['state'] }, // для Redux Toolkit
      ],
      'arrow-parens': ['error', 'as-needed'], // не нужны скобки для одного аргумента
      'brace-style': ['error', '1tbs', { allowSingleLine: true }], // разрешаем закрывающую фигурную в одной строке
    },
  },
]
