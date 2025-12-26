import type {Config} from 'jest';
import {createCjsPreset} from 'jest-preset-angular/presets/index.js';

const presetConfig = createCjsPreset({});

export default {
  ...presetConfig,
  coverageDirectory: 'dist/coverage',
  collectCoverageFrom: ['src/app/**/*.ts', '!src/tests/**'],
  coveragePathIgnorePatterns: ['/node_modules/', 'public-api.ts', '.module.ts', 'index.ts', '.mock.ts', 'test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/jest-setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/test-util/index.ts', '.stories.ts', 'test.ts', '/tests/'],
  snapshotSerializers: ['jest-preset-angular/build/serializers/ng-snapshot', 'jest-preset-angular/build/serializers/html-comment'],
  reporters: ['default', 'jest-junit'],
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
    // !!! mock following dependency
    '^@angular/fire/firestore$': '<rootDir>/src/tests/mocks/angular-fire-firestore.mock.ts',
  },
} satisfies Config;
