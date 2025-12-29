import '@analogjs/vitest-angular/setup-zone';
import '@angular/compiler';

import {getTestBed} from '@angular/core/testing';
import {BrowserTestingModule, platformBrowserTesting} from '@angular/platform-browser/testing';

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());

// import {provideNgReflectAttributes} from '@angular/core';
// import {TestBed} from '@angular/core/testing';
// import {setupZoneTestEnv} from 'jest-preset-angular/setup-env/zone';
// import {Mock} from 'ts-mockery';
// import 'whatwg-fetch'; // <<< installed because of firestore libs
// import './jest-global-mocks';

// Mock.configure('jest');

// setupZoneTestEnv(); // <<< zone.js installed because of this

// beforeEach(() => {
//   TestBed.configureTestingModule({
//     providers: [
//       // below: needed for better snapshots
//       provideNgReflectAttributes(),
//     ],
//   });
// });
