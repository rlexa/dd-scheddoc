import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {jsonEqual} from 'dd-rxjs';
import {
  DbCalendar,
  DbUser,
  DbUserAvailability,
  DbUserQualification,
  isQualificationEligible,
  qualificationsGerman,
  qualificationsOrdered,
  userAvailabilitiesGerman,
} from 'src/app/data/db';
import {IsWeekendPipe} from 'src/app/shared/is-weekend';
import {ToHolidayPipe} from 'src/app/shared/to-holiday';
import {FindFrozenQualificationPipe} from './find-frozen-qualification.pipe';
import {UserCalendarPipe} from './user-calendar.pipe';
import {UsersFilterByCalendarsPipe} from './users-filter-by-calendars.pipe';

@Component({
  selector: 'app-month-assignment',
  templateUrl: './month-assignment.component.html',
  styleUrls: ['./month-assignment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FindFrozenQualificationPipe,
    FormsModule,
    IsWeekendPipe,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    ToHolidayPipe,
    UserCalendarPipe,
    UsersFilterByCalendarsPipe,
  ],
})
export class MonthAssignmentComponent {
  private readonly calendarEntries = signal<DbCalendar[]>([], {equal: jsonEqual});
  private readonly userEntries = signal<DbUser[]>([], {equal: jsonEqual});

  @Input() dateMonth?: string | null;
  @Input() days?: string[] | null;

  @Input() set calendars(val: DbCalendar[] | null | undefined) {
    this.calendarEntries.set(val ?? []);
  }

  @Input() set users(val: DbUser[] | null | undefined) {
    this.userEntries.set(val ?? []);
  }

  @Output() readonly changeFreeze = new EventEmitter<{day: string; quali: DbUserQualification; user: string | null}>();

  protected readonly DbUserAvailability = DbUserAvailability;
  protected readonly availabilitiesGerman = userAvailabilitiesGerman;

  protected readonly DbUserQualification = DbUserQualification;
  protected readonly qualifications = qualificationsOrdered;
  protected readonly qualificationsGerman = qualificationsGerman;

  protected readonly dayEntryMap = computed(
    () =>
      this.calendarEntries().reduce<Record<string, DbCalendar[] | undefined>>((acc, ii) => {
        const key = `${ii.day}T00:00:00.000`;
        return {...acc, [key]: [...(acc[key] ?? []), ii]};
      }, {}),
    {equal: jsonEqual},
  );

  protected readonly qualiToUsersMap = computed(
    () => {
      const users = this.userEntries();

      return Object.values(DbUserQualification)
        .filter((ii) => ii !== DbUserQualification.Test)
        .reduce<Record<DbUserQualification, DbUser[]>>(
          (acc, quali) => ({
            ...acc,
            [quali]: users.filter((uu) => !!uu.id && isQualificationEligible(uu.qualification, quali)),
          }),
          {} as Record<DbUserQualification, DbUser[]>,
        );
    },
    {equal: jsonEqual},
  );

  protected readonly freeze = (day: string, quali: DbUserQualification, user: string | null) => this.changeFreeze.emit({day, quali, user});
}
