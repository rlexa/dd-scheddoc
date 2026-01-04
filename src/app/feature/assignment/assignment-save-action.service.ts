import {DestroyRef, inject, Injectable, OnDestroy} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {collection, doc, Firestore, writeBatch} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material/snack-bar';
import {msSecond} from 'dd-nodom/lib/date';
import {combineLatest, debounceTime, of, Subject, switchMap} from 'rxjs';
import {DiDbCalendars, DiDbCalendarsTrigger} from 'src/app/data';
import {collectionCalendar} from 'src/app/data/db';
import {AssignmentFormService} from './assignment-form.service';

@Injectable()
export class AssignmentSaveActionService implements OnDestroy {
  private readonly calendars$ = inject(DiDbCalendars);
  private readonly calendarsTrigger$ = inject(DiDbCalendarsTrigger);
  private readonly destroyRef = inject(DestroyRef);
  private readonly firestore = inject(Firestore);
  private readonly formService = inject(AssignmentFormService);
  private readonly matSnackBar = inject(MatSnackBar);

  private readonly trigger$ = new Subject<void>();

  constructor() {
    this.init();
  }

  ngOnDestroy() {
    this.trigger$.complete();
  }

  private init() {
    combineLatest([this.calendars$, this.formService.value$])
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
                  if (mm && ii.frozenAs !== mm.frozenAs) {
                    const docRef = doc(this.firestore, collectionCalendar, ii.id);
                    batch.update(docRef, {frozenAs: mm.frozenAs});
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
                console.error('Failed to write assignments.', err);
                return false;
              }
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((success) => {
        if (success) {
          this.matSnackBar.open('Zuweisungen gespeichert.', 'OK', {duration: 2 * msSecond});
          this.calendarsTrigger$.next();
        }
      });
  }

  readonly trigger = () => this.trigger$.next();
}
