import js from '@eslint/js';
export default [
  js.configs.recommended,
  {
    files: ['**/*.mjs'],
    languageOptions: {
      globals: {
        process: 'readonly',
        console: 'readonly',
        URL: 'readonly',
        setTimeout: 'readonly',
        document: 'readonly',
        innerWidth: 'readonly',
        fetch: 'readonly',
        AbortSignal: 'readonly',
      },
    },
    rules: { 'no-unused-vars': ['error', { caughtErrors: 'none' }] },
  },
  { ignores: ['dist/**', 'node_modules/**', '.astro/**'] },
];
