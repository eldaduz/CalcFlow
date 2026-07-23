import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  // Ignore deps + build outputs (repo root + React subproject)
  globalIgnores(['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**']),

  // Lint Thinking like a Developer scripts
  {
    files: ['Thinking like a Developer/**/*.{js,jsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      'prefer-const': 'off',

      // recommended safe autofixes
      'object-shorthand': ['error', 'always'],
      'no-useless-rename': 'error',
      'no-useless-concat': 'error',
      'no-useless-escape': 'error',
    },
  },

  // MUST be last: disables ESLint rules that conflict with Prettier
  eslintConfigPrettier,
]);
