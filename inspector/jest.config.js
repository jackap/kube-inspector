module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'json', 'node','js'],
  moduleNameMapper: {
    // This allows importing modules from the tests/ folder using an absolute path
    '^tests/(.*)$': '<rootDir>/tests/$1',
    // This allows importing modules from the src/ folder using an absolute path
    '^app/(.*)$': '<rootDir>/src/$1',
  },
  modulePaths: ['<rootDir>/src'],
  testRegex: '/tests/.*(test|spec)\\.(ts)x?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
};
