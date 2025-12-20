// /* eslint-disable import/no-extraneous-dependencies */

// import { FlatCompat } from '@eslint/eslintrc'
// import importPlugin from 'eslint-plugin-import'
// import jsxA11y from 'eslint-plugin-jsx-a11y'
// import globals from 'globals'

// const compat = new FlatCompat({ baseDir: process.cwd() })

// export default [
//   // Игнорируем папки
//   { ignores: ['node_modules/', 'dist/', 'build/'] },

//   {
//     plugins: {
//       import: importPlugin,
//       'jsx-a11y': jsxA11y,
//     },
//   },

//   // AirBnB правила
//   ...compat.extends('airbnb'),
//   // React правила
//   ...compat.extends('plugin:react/recommended'),
//   // React Hooks правила
//   ...compat.extends('plugin:react-hooks/recommended'),

//   // Функциональные правила подключаем напрямую
//   {
//     files: ['**/*.js', '**/*.jsx'],
//     languageOptions: {
//       ecmaVersion: 'latest',
//       sourceType: 'module',
//       globals: {
//         ...globals.browser,
//         ...globals.node,
//       },
//     },
//     rules: {
//       semi: ['error', 'never'],
//       'functional/no-conditional-statements': 'off',
//       'functional/no-expression-statements': 'off',
//       'functional/immutable-data': 'off',
//       'functional/functional-parameters': 'off',
//       'functional/no-try-statements': 'off',
//       'functional/no-throw-statements': 'off',
//       'functional/no-return-void': 'off',
//       'import/prefer-default-export': 'off',

//       'import/extensions': 'off',
//       'import/no-unresolved': 'off',
//       'react/prop-types': 'off',
//       'no-console': 'off',
//       'react/react-in-jsx-scope': 'off',
//       'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],
//       'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
//       'testing-library/no-debug': 'off',
//       'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
//     },
//   },
// ]
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import stylistic from '@stylistic/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/'],
  },

  js.configs.recommended,

  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
      '@stylistic': stylistic,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
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
    rules: {
      // стиль
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/quote-props': ['error', 'as-needed'],
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'off',

      // react
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // import
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',

      // прочее
      'no-console': 'off',
    },
  },
]
