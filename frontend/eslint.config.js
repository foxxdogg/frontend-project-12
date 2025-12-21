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
//       'arrow-parens': ['error', 'as-needed'],
//       'brace-style': ['error', '1tbs', { allowSingleLine: true }],
//       indent: ['error', 2],
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
// import { FlatCompat } from '@eslint/eslintrc'
// import importPlugin from 'eslint-plugin-import'
// import jsxA11y from 'eslint-plugin-jsx-a11y'
// import globals from 'globals'

// const compat = new FlatCompat({ baseDir: process.cwd() })

// export default [
//   { ignores: ['node_modules/', 'dist/', 'build/'] },

//   ...compat.extends('airbnb', 'plugin:react/recommended', 'plugin:react-hooks/recommended'),

//     {
//     plugins: {
//       import: importPlugin,
//       'jsx-a11y': jsxA11y,
//       '@stylistic': stylistic,
//     },

//     languageOptions: {
//       ecmaVersion: 'latest',
//       sourceType: 'module',
//       globals: {
//         ...globals.browser,
//         ...globals.node,
//       },
//     },

//   files: ['eslint.config.js'],
//   languageOptions: {
//     globals: {
//       process: 'readonly',
//     },
//   },

//     settings: {
//       react: {
//         version: 'detect',
//       },
//     },
//   },

//   {
//     plugins: {
//       import: importPlugin,
//     },
//   },

//   {
//     files: ['vite.config.js', 'eslint.config.js'],
//     rules: {
//       'import/no-extraneous-dependencies': 'off',
//     },
//   },
//   {
//     rules: {
//       semi: ['error', 'never'],
//       'react/prop-types': 'off',
//       'react/react-in-jsx-scope': 'off',
//       'import/prefer-default-export': 'off',
//       'import/extensions': 'off',
//       'import/no-unresolved': 'off',
//       'no-console': 'off',
//       '@stylistic/quote-props': 'off'
//     },
//   },

//   ...compat.extends('prettier'),
// ]

import { FlatCompat } from '@eslint/eslintrc'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

const compat = new FlatCompat({
  baseDir: new URL('.', import.meta.url).pathname,
})

export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/'],
  },

  ...compat.extends(
    'airbnb',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ),

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
  {
    files: ['eslint.config.js', 'vite.config.js'],
    rules: {
      'import/no-extraneous-dependencies': 'off',
    },
  },
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
    },
  },
]
