import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  // Ignore deps + build outputs (repo root + React subproject)
  globalIgnores(['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**']),

  // MUST be last: disables ESLint rules that conflict with Prettier
  eslintConfigPrettier,
]);
