module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-redux)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup.js',
    '!./jest.setup.ts',
    // Loại trừ các file cấu hình hoặc file không cần test khác
    '!./app.json',
    '!./babel.config.js',
    '!./eslint.config.js',
    '!./expo-env.d.ts',
    '!./metro.config.js', // Nếu bạn có file này
    '!./index.js', // Hoặc file entry point của bạn
    '!./store/index.ts', // Có thể test store riêng
  ],
   // Thêm moduleNameMapper để mock expo-router
  moduleNameMapper: {
    '^expo-router$': '<rootDir>/__mocks__/expo-router.js' // Đường dẫn tới file mock
  }
}; 