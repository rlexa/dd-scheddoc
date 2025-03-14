import {inject, InjectionToken} from '@angular/core';
import {collection, collectionData, Firestore, orderBy, query, where} from '@angular/fire/firestore';
import {catchError, distinctUntilChanged, map, Observable, of, startWith, Subject, switchMap} from 'rxjs';
import {Environment} from 'src/environments/environment';
import {fanOut, jsonEqual} from 'src/util';
import {collectionUser, DbUser, DbUserKey, DbUserQualification} from './db';

const withTestUsers = Environment.withTestUsers;

export const DiDbUsersTrigger = new InjectionToken<Subject<void>>('DB users trigger.', {
  providedIn: 'root',
  factory: () => new Subject<void>(),
});

const idField: DbUserKey = 'id';
const keyOrderBy: DbUserKey = 'name';
const keyQuali: DbUserKey = 'qualification';

export const DiDbUsers = new InjectionToken<Observable<DbUser[]>>('DB users.', {
  providedIn: 'root',
  factory: () => {
    const api = inject(Firestore);
    const trigger$ = inject(DiDbUsersTrigger);

    const ref = collection(api, collectionUser);

    return trigger$.pipe(
      startWith('meh'),
      switchMap(() =>
        collectionData(
          withTestUsers
            ? query(ref, orderBy(keyOrderBy))
            : query(ref, where(keyQuali, '!=', DbUserQualification.Test), orderBy(keyOrderBy)),
          {idField},
        ).pipe(
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
