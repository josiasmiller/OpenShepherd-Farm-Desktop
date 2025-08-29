
module.exports = {
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
            testMatch: ['<rootDir>/**/*.test.ts'],
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
