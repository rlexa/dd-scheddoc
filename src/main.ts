import {provideHttpClient} from '@angular/common/http';
import {LOCALE_ID, provideAppInitializer, provideNgReflectAttributes, provideZonelessChangeDetection} from '@angular/core';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {AppComponent} from './app/app.component';
import {initializeLocaleFactory} from './locale';
import {RouteMain} from './routing';

bootstrapApplication(AppComponent, {
  providers: [
    // ng
    provideHttpClient(),
    provideZonelessChangeDetection(),
    provideNgReflectAttributes(), // <<< for test snapshots only
    // 3rd party
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'dd-scheddoc',
        appId: '1:303691106802:web:65f3062c113bc28f68c36b',
        databaseURL: 'https://dd-scheddoc-default-rtdb.europe-west1.firebasedatabase.app',
        storageBucket: 'dd-scheddoc.firebasestorage.app',
        apiKey: 'AIzaSyA-Bo1pxZ6diAoLvWBlhGhRJBiYCR0l5sE',
        authDomain: 'dd-scheddoc.firebaseapp.com',
        messagingSenderId: '303691106802',
      }),
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    // local
    {provide: LOCALE_ID, useValue: 'de-DE'},
    provideAppInitializer(initializeLocaleFactory(['de-DE'])),
    provideRouter(
      [
        {path: RouteMain, loadChildren: () => import('./app/feature/main/routes')},
        {path: '', redirectTo: RouteMain, pathMatch: 'full'},
        {path: '**', redirectTo: ''},
      ],
      withComponentInputBinding(),
    ),
  ],
}).catch((err) => console.error(err));
