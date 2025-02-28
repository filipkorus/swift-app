module.exports = {
    globalSetup: './tests/globalSetup.ts',
    globalTeardown: './tests/globalTeardown.ts',
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
};
