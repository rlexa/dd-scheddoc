import {DestroyRef, inject, Injectable, OnDestroy} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {collection, doc, Firestore, writeBatch} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material/snack-bar';
import {msSecond} from 'dd-nodom/date';
import {combineLatest, debounceTime, of, Subject, switchMap} from 'rxjs';
import {DiDbCalendar, DiDbCalendarTrigger} from 'src/app/data';
import {collectionCalendar} from 'src/app/data/db';
import {CalendarFormService} from './calendar-form.service';

@Injectable()
export class CalendarSaveActionService implements OnDestroy {
  private readonly dbCalendar$ = inject(DiDbCalendar);
  private readonly dbCalendarTrigger$ = inject(DiDbCalendarTrigger);
  private readonly destroyRef = inject(DestroyRef);
  private readonly firestore = inject(Firestore);
  private readonly formService = inject(CalendarFormService);
  private readonly matSnackBar = inject(MatSnackBar);

  private readonly trigger$ = new Subject<void>();

  constructor() {
    this.init();
  }

  ngOnDestroy() {
    this.trigger$.complete();
  }

  private init() {
    combineLatest([this.dbCalendar$, this.formService.value$])
      .pipe(
        debounceTime(0),
        switchMap(([source, model]) =>
          this.trigger$.pipe(
            switchMap(async () => {
              if (!source || !model) {
                return of(null);
              }

              const batch = writeBatch(this.firestore);

              source.forEach((ii) => {
                if (ii.id) {
                  const mm = model.find((mm) => mm.id === ii.id);
                  if (!mm) {
                    const docRef = doc(this.firestore, collectionCalendar, ii.id);
                    batch.delete(docRef);
                  } else if (ii.availability !== mm.availability) {
                    const docRef = doc(this.firestore, collectionCalendar, ii.id);
                    batch.update(docRef, {availability: mm.availability});
                  }
                }
              });

              model
                .filter((mm) => !mm.id)
                .forEach((mm) => {
                  const colRef = collection(this.firestore, collectionCalendar);
                  const docRef = doc(colRef);
                  batch.set(docRef, mm);
                });

              try {
                batch.commit();
                return true;
              } catch (err) {
                console.error('Failed to write calendar.', err);
                return false;
              }
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((success) => {
        if (success) {
          this.matSnackBar.open('Kalendar gespeichert.', 'OK', {duration: 2 * msSecond});
          this.dbCalendarTrigger$.next();
        }
      });
  }

  readonly trigger = () => this.trigger$.next();
}
