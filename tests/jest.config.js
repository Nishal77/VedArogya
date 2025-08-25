module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/**/*.(test|spec).(ts|tsx|js)'
  ],
  collectCoverageFrom: [
    '../**/*.{ts,tsx}',
    '!../**/coverage/**',
    '!../**/node_modules/**',
    '!../**/babel.config.js',
    '!**/jest.setup.js'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  rootDir: '../'
};
