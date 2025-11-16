/* eslint-disable import/no-extraneous-dependencies */

import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDir: process.cwd() });

export default [
  // Игнорируем папки
  { ignores: ['node_modules/', 'dist/', 'build/'] },

  // AirBnB правила
  ...compat.extends('airbnb'),
  // React правила
  ...compat.extends('plugin:react/recommended'),
  // React Hooks правила
  ...compat.extends('plugin:react-hooks/recommended'),

  // Функциональные правила подключаем напрямую
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      globals: {
        document: 'readonly',
        window: 'readonly',
      },
    },
    rules: {
      'functional/no-conditional-statements': 'off',
      'functional/no-expression-statements': 'off',
      'functional/immutable-data': 'off',
      'functional/functional-parameters': 'off',
      'functional/no-try-statements': 'off',
      'functional/no-throw-statements': 'off',
      'functional/no-return-void': 'off',

      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'react/prop-types': 'off',
      'no-console': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],
      'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      'testing-library/no-debug': 'off',
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    },
  },
];
