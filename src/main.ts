import {provideHttpClient} from '@angular/common/http';
import {LOCALE_ID, provideAppInitializer, provideExperimentalZonelessChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {initializeLocaleFactory} from './locale';

bootstrapApplication(AppComponent, {
  providers: [
    // ng
    provideHttpClient(),
    provideExperimentalZonelessChangeDetection(),
    // local
    {provide: LOCALE_ID, useValue: 'de-DE'},
    provideAppInitializer(initializeLocaleFactory(['de-DE'])),
    // provideRouter(
    //   [
    //     {path: RouteMain, loadChildren: () => import('./app/feature/main/routes')},
    //     {path: '', redirectTo: RouteMain, pathMatch: 'full'},
    //     {path: '**', redirectTo: ''},
    //   ],
    //   withComponentInputBinding(),
    // ),
  ],
}).catch((err) => console.error(err));
