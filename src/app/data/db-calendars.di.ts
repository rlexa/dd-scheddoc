import {inject, InjectionToken} from '@angular/core';
import {collection, collectionData, Firestore, orderBy, query, where} from '@angular/fire/firestore';
import {jsonEqual, rxFanOut} from 'dd-rxjs';
import {catchError, combineLatest, distinctUntilChanged, map, Observable, of, startWith, Subject, switchMap} from 'rxjs';
import {dateToEndOfMonthDatePart, dateToStartOfMonthDatePart} from 'src/util-date';
import {DiSelectedDate} from './active';
import {collectionCalendar, DbCalendar, DbCalendarKey} from './db';

export const DiDbCalendarsTrigger = new InjectionToken<Subject<void>>('DB calendars trigger.', {
  providedIn: 'root',
  factory: () => new Subject<void>(),
});

const idField: DbCalendarKey = 'id';
const keyOrderBy: DbCalendarKey = 'day';
const keyDay: DbCalendarKey = 'day';

/** Day-to-entry calendar for all users. */
export const DiDbCalendars = new InjectionToken<Observable<DbCalendar[]>>('DB calendars.', {
  providedIn: 'root',
  factory: () => {
    const api = inject(Firestore);
    const selectedDate$ = inject(DiSelectedDate);
    const trigger$ = inject(DiDbCalendarsTrigger);

    const ref = collection(api, collectionCalendar);

    return combineLatest([selectedDate$]).pipe(
      switchMap(([selectedDate]) =>
        trigger$.pipe(
          startWith('meh'),
          switchMap(() =>
            !selectedDate || selectedDate.length < 'yyyy-mm-dd'.length
              ? of<DbCalendar[]>([])
              : collectionData(
                  query(
                    ref,
                    where(keyDay, '>=', dateToStartOfMonthDatePart(selectedDate)),
                    where(keyDay, '<=', dateToEndOfMonthDatePart(selectedDate)),
                    orderBy(keyOrderBy),
                  ),
                  {idField},
                ).pipe(
                  map((ii) => (ii ?? []) as DbCalendar[]),
                  catchError((err) => {
                    console.error('Failed to fetch DB calendars.', err);
                    return of<DbCalendar[]>([]);
                  }),
                ),
          ),
        ),
      ),
      distinctUntilChanged(jsonEqual),
      rxFanOut(),
    );
  },
});
