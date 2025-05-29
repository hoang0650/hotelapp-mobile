// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['__mocks__/**/*.js', '**/*.test.js', '**/*.test.tsx'], // Áp dụng cho file mocks và tests
    languageOptions: {
      globals: {
        jest: 'readonly', // Hoặc 'writable' nếu bạn mock jest object
        expect: 'readonly',
        test: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        it: 'readonly', // Alias cho test
      },
    },
  }
]);
