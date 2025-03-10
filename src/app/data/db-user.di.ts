import {inject, InjectionToken} from '@angular/core';
import {doc, docData, Firestore} from '@angular/fire/firestore';
import {catchError, distinctUntilChanged, filter, map, Observable, of, switchMap} from 'rxjs';
import {fanOut, jsonEqual} from 'src/util';
import {DiUser} from './active';
import {collectionUser, DbUser} from './db';

export const DiDbUser = new InjectionToken<Observable<DbUser | null>>('Current DB user.', {
  providedIn: 'root',
  factory: () => {
    const api = inject(Firestore);
    const user$ = inject(DiUser);

    return user$.pipe(
      filter((user) => user !== undefined),
      switchMap((user) =>
        !user
          ? of<DbUser | null>(null)
          : docData(doc(api, collectionUser, user.uid), {idField: 'id'}).pipe(
              map((ii) => ii as DbUser),
              catchError((err) => {
                console.error('Failed to fetch DB user.', err);
                return of<DbUser | null>(null);
              }),
            ),
      ),
      distinctUntilChanged(jsonEqual),
      fanOut(),
    );
  },
});
