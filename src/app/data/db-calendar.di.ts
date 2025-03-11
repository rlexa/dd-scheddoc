import {inject, InjectionToken} from '@angular/core';
import {collection, collectionData, Firestore, orderBy, query, where} from '@angular/fire/firestore';
import {catchError, combineLatest, distinctUntilChanged, map, Observable, of, startWith, Subject, switchMap} from 'rxjs';
import {fanOut, jsonEqual} from 'src/util';
import {dateToEndOfMonthDatePart, dateToStartOfMonthDatePart} from 'src/util-date';
import {DiSelectedDate} from './active';
import {collectionCalendar, DbCalendar, DbCalendarKey} from './db';
import {DiDbUser} from './db-user.di';

export const DiDbCalendarTrigger = new InjectionToken<Subject<void>>('DB calendar trigger.', {
  providedIn: 'root',
  factory: () => new Subject<void>(),
});

const idField: DbCalendarKey = 'id';
const keyOrderBy: DbCalendarKey = 'day';
const keyDay: DbCalendarKey = 'day';
const keyUser: DbCalendarKey = 'user';

export const DiDbCalendar = new InjectionToken<Observable<DbCalendar[]>>('DB calendar.', {
  providedIn: 'root',
  factory: () => {
    const api = inject(Firestore);
    const dbUser$ = inject(DiDbUser);
    const selectedDate$ = inject(DiSelectedDate);
    const trigger$ = inject(DiDbCalendarTrigger);

    const ref = collection(api, collectionCalendar);

    return combineLatest([dbUser$, selectedDate$]).pipe(
      switchMap(([dbUser, selectedDate]) =>
        trigger$.pipe(
          startWith('meh'),
          switchMap(() =>
            !dbUser?.id || !selectedDate || selectedDate.length < 'yyyy-mm-dd'.length
              ? of<DbCalendar[]>([])
              : collectionData(
                  query(
                    ref,
                    where(keyUser, '==', dbUser.id),
                    where(keyDay, '>=', dateToStartOfMonthDatePart(selectedDate)),
                    where(keyDay, '<=', dateToEndOfMonthDatePart(selectedDate)),
                    orderBy(keyOrderBy),
                  ),
                  {idField},
                ).pipe(
                  map((ii) => (ii ?? []) as DbCalendar[]),
                  catchError((err) => {
                    console.error('Failed to fetch DB calendar.', err);
                    return of<DbCalendar[]>([]);
                  }),
                ),
          ),
        ),
      ),
      distinctUntilChanged(jsonEqual),
      fanOut(),
    );
  },
});
