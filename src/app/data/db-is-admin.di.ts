import {inject, InjectionToken} from '@angular/core';
import {map, Observable} from 'rxjs';
import {DbUserGroup} from './db';
import {DiDbUser} from './db-user.di';

export const DiIsAdmin = new InjectionToken<Observable<boolean>>('Is-admin user flag.', {
  providedIn: 'root',
  factory: () => {
    const dbUser$ = inject(DiDbUser);

    return dbUser$.pipe(
      map((user) => user?.group ?? DbUserGroup.User),
      map((group) => group === DbUserGroup.Admin),
    );
  },
});
