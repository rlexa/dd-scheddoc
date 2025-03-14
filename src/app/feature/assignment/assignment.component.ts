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
import {DiDbCalendars, DiDbCalendarsTrigger, DiDbUsers} from 'src/app/data';
import {DiSelectedDate} from 'src/app/data/active';
import {collectionCalendar, DbUserQualification} from 'src/app/data/db';
import {ToMonthDaysPipe} from 'src/app/shared/to-month-days';
import {generateCurrentMonths, msSecond} from 'src/util-date';
import {AssignmentFormService} from './assignment-form.service';
import {MonthAssignmentComponent} from './month-assignment';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSnackBarModule,
    MonthAssignmentComponent,
    ToMonthDaysPipe,
  ],
  providers: [AssignmentFormService],
})
export class AssignmentComponent implements OnInit, OnDestroy {
  private readonly calendars$ = inject(DiDbCalendars);
  private readonly calendarsTrigger$ = inject(DiDbCalendarsTrigger);
  private readonly destroyRef = inject(DestroyRef);
  private readonly firestore = inject(Firestore);
  private readonly formService = inject(AssignmentFormService);
  private readonly matSnackBar = inject(MatSnackBar);
  protected readonly selectedDate$ = inject(DiSelectedDate);
  protected readonly users$ = inject(DiDbUsers);

  private readonly saveTrigger$ = new Subject<void>();

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
    this.calendars$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((ii) => this.formService.setSource(ii));

    combineLatest([this.calendars$, this.formService.value$])
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

    this.dates = generateCurrentMonths();
    this.selectedDate$.next(this.dates[1]);
  }

  protected readonly reset = () => this.formService.reset();
  protected readonly save = () => this.saveTrigger$.next();

  protected readonly changeFreeze = (day: string, quali: DbUserQualification, user: string | null) =>
    this.formService.changeFreeze(day, quali, user);

  protected readonly setSelectedDate = (val: string) => this.selectedDate$.next(val);
}
