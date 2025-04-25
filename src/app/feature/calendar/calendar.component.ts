import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {combineLatest, distinctUntilChanged, filter, map, take} from 'rxjs';
import {DiDbCalendar, DiDbUser, DiDbUsers, DiIsAdmin} from 'src/app/data';
import {DiSelectedDate, DiSelectedUserId} from 'src/app/data/active';
import {
  DbCalendar,
  DbUserAvailability,
  DbUserQualification,
  qualificationsGerman,
  userAvailabilitiesGerman,
  userAvailabilitiesOrdered,
} from 'src/app/data/db';
import {ToMonthDaysPipe} from 'src/app/shared/to-month-days';
import {downloadBlob, notNullUndefined} from 'src/util';
import {generateCurrentMonths} from 'src/util-date';
import {CalendarFormService} from './calendar-form.service';
import {CalendarSaveActionService} from './calendar-save-action.service';
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
    MatSelectModule,
    MatSnackBarModule,
    MonthComponent,
    ToMonthDaysPipe,
  ],
  providers: [CalendarFormService, CalendarSaveActionService],
})
export class CalendarComponent implements OnInit, OnDestroy {
  private readonly dbCalendar$ = inject(DiDbCalendar);
  private readonly dbUser$ = inject(DiDbUser);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formService = inject(CalendarFormService);
  protected readonly isAdmin$ = inject(DiIsAdmin);
  private readonly saveActionService = inject(CalendarSaveActionService);
  protected readonly selectedDate$ = inject(DiSelectedDate);
  protected readonly selectedUserId$ = inject(DiSelectedUserId);
  protected readonly users$ = inject(DiDbUsers);

  protected readonly DbUserQualification = DbUserQualification;
  protected readonly qualificationsGerman = qualificationsGerman;

  protected readonly formValue$ = this.formService.value$;
  protected readonly canReset$ = this.formService.canReset$;

  protected readonly canSave$ = combineLatest([this.formService.hasChanges$, this.formService.valid$]).pipe(
    map(([hasChanges, valid]) => hasChanges && valid),
    distinctUntilChanged(),
  );

  protected readonly dates = generateCurrentMonths();

  ngOnDestroy() {
    this.selectedDate$.next(null);
    this.selectedUserId$.next(null);
  }

  ngOnInit() {
    this.dbCalendar$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((ii) => this.formService.setSource(ii));

    this.dbUser$
      .pipe(filter(notNullUndefined), take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => this.selectedUserId$.next(user.id ?? null));

    this.selectedDate$.next(this.dates[1]);
  }

  protected readonly reset = () => this.formService.reset();
  protected readonly save = () => this.saveActionService.trigger();

  protected readonly setAvailability = (user: string, date: string, value: DbUserAvailability | null) =>
    this.formService.setAvailability(user, date, value);

  protected readonly setSelectedDate = (val: string) => this.selectedDate$.next(val);
  protected readonly setSelectedUserId = (id: string | null) => this.selectedUserId$.next(id);

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
