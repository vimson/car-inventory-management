module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src/tests', '<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
