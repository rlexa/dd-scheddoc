import {inject, InjectionToken} from '@angular/core';
import {collection, collectionData, Firestore, orderBy, query} from '@angular/fire/firestore';
import {catchError, distinctUntilChanged, map, Observable, of, startWith, Subject, switchMap} from 'rxjs';
import {fanOut, jsonEqual} from 'src/util';
import {collectionUser, DbUser, DbUserKey} from './db';

export const DiDbUsersTrigger = new InjectionToken<Subject<void>>('DB users trigger.', {
  providedIn: 'root',
  factory: () => new Subject<void>(),
});

const idField: DbUserKey = 'id';
const keyOrderBy: DbUserKey = 'name';

export const DiDbUsers = new InjectionToken<Observable<DbUser[]>>('DB users.', {
  providedIn: 'root',
  factory: () => {
    const api = inject(Firestore);
    const trigger$ = inject(DiDbUsersTrigger);

    const ref = collection(api, collectionUser);

    return trigger$.pipe(
      startWith('meh'),
      switchMap(() =>
        collectionData(query(ref, orderBy(keyOrderBy)), {idField}).pipe(
          map((ii) => (ii ?? []) as DbUser[]),
          catchError((err) => {
            console.error('Failed to fetch DB users.', err);
            return of<DbUser[]>([]);
          }),
        ),
      ),
      distinctUntilChanged(jsonEqual),
      fanOut(),
    );
  },
});
