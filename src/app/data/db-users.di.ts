import {inject, InjectionToken} from '@angular/core';
import {collection, collectionData, Firestore, orderBy, query} from '@angular/fire/firestore';
import {catchError, distinctUntilChanged, map, Observable, of, startWith, Subject, switchMap} from 'rxjs';
import {fanOut, jsonEqual} from 'src/util';
import {DbUser} from './db';

export const DiDbUsersTrigger = new InjectionToken<Subject<void>>('DB users trigger.', {
  providedIn: 'root',
  factory: () => new Subject<void>(),
});

export const DiDbUsers = new InjectionToken<Observable<DbUser[]>>('DB users.', {
  providedIn: 'root',
  factory: () => {
    const api = inject(Firestore);
    const trigger$ = inject(DiDbUsersTrigger);

    const ref = collection(api, 'user');

    return trigger$.pipe(
      startWith('meh'),
      switchMap(() =>
        collectionData(query(ref, orderBy('name')), {idField: 'id'}).pipe(
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
