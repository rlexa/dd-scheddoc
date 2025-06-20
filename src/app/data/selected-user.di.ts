import {inject, InjectionToken} from '@angular/core';
import {jsonEqual, rxFanOut} from 'dd-rxjs';
import {combineLatest, distinctUntilChanged, map, Observable} from 'rxjs';
import {DiSelectedUserId} from './active';
import {DbUser} from './db';
import {DiDbUsers} from './db-users.di';

export const DiSelectedUser = new InjectionToken<Observable<DbUser | null>>('Selected user.', {
  providedIn: 'root',
  factory: () => {
    const dbUsers$ = inject(DiDbUsers);
    const id$ = inject(DiSelectedUserId);

    return combineLatest([id$, dbUsers$]).pipe(
      map(([id, users]) => (!id ? null : (users.find((ii) => ii.id === id) ?? null))),
      distinctUntilChanged(jsonEqual),
      rxFanOut(),
    );
  },
});
