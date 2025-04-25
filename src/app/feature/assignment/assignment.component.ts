import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {combineLatest, distinctUntilChanged, map} from 'rxjs';
import {DiDbCalendars, DiDbUsers} from 'src/app/data';
import {DiSelectedDate} from 'src/app/data/active';
import {DbCalendar, DbUser, DbUserQualification, qualificationsGerman, qualificationsOrdered} from 'src/app/data/db';
import {ToMonthDaysPipe} from 'src/app/shared/to-month-days';
import {Environment} from 'src/environments/environment';
import {downloadBlob, fanOut, jsonEqual} from 'src/util';
import {generateCurrentMonths} from 'src/util-date';
import {AssignmentFormService} from './assignment-form.service';
import {AssignmentInfoActionService} from './assignment-info-action.service';
import {AssignmentSaveActionService} from './assignment-save-action.service';
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
    MatDialogModule,
    MatIconModule,
    MonthAssignmentComponent,
    ToMonthDaysPipe,
  ],
  providers: [AssignmentFormService, AssignmentInfoActionService, AssignmentSaveActionService],
})
export class AssignmentComponent implements OnInit, OnDestroy {
  private readonly calendars$ = inject(DiDbCalendars);
  private readonly destroyRef = inject(DestroyRef);
  private readonly formService = inject(AssignmentFormService);
  private readonly infoActionService = inject(AssignmentInfoActionService);
  private readonly saveActionService = inject(AssignmentSaveActionService);
  protected readonly selectedDate$ = inject(DiSelectedDate);
  private readonly usersAll$ = inject(DiDbUsers);

  protected readonly formValue$ = this.formService.value$;
  protected readonly canReset$ = this.formService.canReset$;

  protected readonly canSave$ = combineLatest([this.formService.hasChanges$, this.formService.valid$]).pipe(
    map(([hasChanges, valid]) => hasChanges && valid),
    distinctUntilChanged(),
  );

  protected readonly users$ = this.usersAll$.pipe(
    map((iis) => iis.filter((user) => Environment.withTestUsers || user.qualification !== DbUserQualification.Test)),
    distinctUntilChanged(jsonEqual),
    fanOut(),
  );

  protected readonly dates = generateCurrentMonths();

  ngOnDestroy() {
    this.selectedDate$.next(null);
  }

  ngOnInit() {
    this.calendars$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((ii) => this.formService.setSource(ii));

    this.selectedDate$.next(this.dates[1]);
  }

  protected readonly reset = () => this.formService.reset();
  protected readonly save = () => this.saveActionService.trigger();
  protected readonly showInfo = (entries: DbCalendar[], users: DbUser[]) => this.infoActionService.trigger({entries, users});

  protected readonly changeFreeze = (day: string, quali: DbUserQualification, user: string | null) =>
    this.formService.changeFreeze(day, quali, user);

  protected readonly setSelectedDate = (val: string) => this.selectedDate$.next(val);

  protected readonly calculate = (days: string[], users: DbUser[] | null) => this.formService.tryCalculateAssignments(days, users ?? []);
  protected readonly clearAll = () => this.formService.clearAll();

  protected download(days: string[], entries: DbCalendar[], users: DbUser[] | null) {
    const csv = [
      `Tag;${qualificationsOrdered.map((ii) => qualificationsGerman[ii]).join(';')}`,
      ...days
        .map((day) => day.substring(0, 'yyyy-mm-dd'.length))
        .map((day) =>
          [
            day,
            ...qualificationsOrdered.map((quali) => {
              const entry = entries.find((ee) => ee.day === day && ee.frozenAs === quali);
              if (entry) {
                return users?.find((uu) => uu.id === entry.user)?.name ?? entry.user;
              }
              return '';
            }),
          ].join(';'),
        ),
    ].join('\n');

    downloadBlob(new Blob([csv], {type: 'text/csv'}), 'zuweisungen.csv');
  }
}
