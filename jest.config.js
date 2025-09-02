
module.exports = {
    globals: {
        'ts-jest': {
            tsconfig: false
        }
    },
    projects: [
        {
            preset: 'ts-jest',
            displayName: 'main',
            testEnvironment: 'node',
            rootDir: './src/main',
            testMatch: ['<rootDir>/**/*.test.ts'],
        },
        {
            preset: 'ts-jest',
            displayName: 'renderer',
            testEnvironment: 'jsdom',
            rootDir: './src/renderer',
            testMatch: ['<rootDir>/**/*.test.ts?(x)'],
            setupFiles: ['<rootDir>/jest.setup.ts'],
            setupFilesAfterEnv: ['<rootDir>/jest.setup-env.ts'],
            moduleNameMapper: {
                "^packages/(.*)$": "<rootDir>/../packages/$1",
                "\\.(png)$": "<rootDir>/../__mocks__/fileMock.js",
                "\\.(css|less|scss|sass)$": "identity-obj-proxy"
            }
        },
        {
            preset: 'ts-jest',
            displayName: 'packages',
            testEnvironment: 'node',
            rootDir: './src/packages',
            testMatch: ['<rootDir>/**/*.test.ts'],
        }
    ],
}
