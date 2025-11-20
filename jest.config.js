// https://stackoverflow.com/questions/51080947/how-to-use-path-alias-in-a-react-project-with-typescript-jest
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require('./tsconfig');


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
            moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/../../' } )
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
