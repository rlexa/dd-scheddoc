import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {collection, doc, Firestore, writeBatch} from '@angular/fire/firestore';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {combineLatest, debounceTime, distinctUntilChanged, map, of, Subject, switchMap} from 'rxjs';
import {DiDbCalendar, DiDbCalendarTrigger, DiDbUser} from 'src/app/data';
import {DiSelectedDate} from 'src/app/data/active';
import {collectionCalendar, DbCalendar, DbUserAvailability, userAvailabilitiesGerman, userAvailabilitiesOrdered} from 'src/app/data/db';
import {ToMonthDaysPipe} from 'src/app/shared/to-month-days';
import {downloadBlob, fanOut} from 'src/util';
import {generateCurrentMonths, msSecond} from 'src/util-date';
import {CalendarFormService} from './calendar-form.service';
import {MonthComponent} from './month';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSnackBarModule,
    MonthComponent,
    ToMonthDaysPipe,
  ],
  providers: [CalendarFormService],
})
export class CalendarComponent implements OnInit, OnDestroy {
  private readonly dbCalendar$ = inject(DiDbCalendar);
  private readonly dbCalendarTrigger$ = inject(DiDbCalendarTrigger);
  private readonly dbUser$ = inject(DiDbUser);
  private readonly destroyRef = inject(DestroyRef);
  private readonly firestore = inject(Firestore);
  private readonly formService = inject(CalendarFormService);
  private readonly matSnackBar = inject(MatSnackBar);
  protected readonly selectedDate$ = inject(DiSelectedDate);

  private readonly saveTrigger$ = new Subject<void>();

  protected readonly id$ = this.dbUser$.pipe(
    map((ii) => ii?.id ?? null),
    distinctUntilChanged(),
    fanOut(),
  );

  protected readonly formValue$ = this.formService.value$;
  protected readonly canReset$ = this.formService.canReset$;

  protected readonly canSave$ = combineLatest([this.formService.hasChanges$, this.formService.valid$]).pipe(
    map(([hasChanges, valid]) => hasChanges && valid),
    distinctUntilChanged(),
  );

  protected dates: string[] = [];

  ngOnDestroy() {
    this.saveTrigger$.complete();
    this.selectedDate$.next(null);
  }

  ngOnInit() {
    this.dbCalendar$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((ii) => this.formService.setSource(ii));

    combineLatest([this.dbCalendar$, this.formService.value$])
      .pipe(
        debounceTime(0),
        switchMap(([source, model]) =>
          this.saveTrigger$.pipe(
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

    this.dates = generateCurrentMonths();
    this.selectedDate$.next(this.dates[1]);
  }

  protected readonly reset = () => this.formService.reset();
  protected readonly save = () => this.saveTrigger$.next();

  protected readonly setAvailability = (user: string, date: string, value: DbUserAvailability | null) =>
    this.formService.setAvailability(user, date, value);

  protected readonly setSelectedDate = (val: string) => this.selectedDate$.next(val);

  protected download(days: string[], entries: DbCalendar[]) {
    const csv = [
      `Tag;${userAvailabilitiesOrdered.map((ii) => userAvailabilitiesGerman[ii]).join(';')}`,
      ...days
        .map((day) => day.substring(0, 'yyyy-mm-dd'.length))
        .map((day) =>
          [
            day,
            ...userAvailabilitiesOrdered.map((avail) => {
              const entry = entries.find((ee) => ee.day === day);
              if (!entry && avail === DbUserAvailability.None) {
                return 'x';
              } else if (entry?.availability === avail) {
                return 'x';
              }
              return '';
            }),
          ].join(';'),
        ),
    ].join('\n');

    downloadBlob(new Blob([csv], {type: 'text/csv'}), 'monat.csv');
  }
}
