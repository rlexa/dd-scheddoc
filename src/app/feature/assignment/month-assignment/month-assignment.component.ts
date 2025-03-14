import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, Input, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DbCalendar, DbUser, DbUserQualification, qualificationsGerman, qualificationsOrdered} from 'src/app/data/db';
import {IsWeekendPipe} from 'src/app/shared/is-weekend';
import {ToHolidayPipe} from 'src/app/shared/to-holiday';
import {jsonEqual} from 'src/util';

@Component({
  selector: 'app-month-assignment',
  templateUrl: './month-assignment.component.html',
  styleUrls: ['./month-assignment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IsWeekendPipe, MatIconModule, MatTooltipModule, ToHolidayPipe],
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

  protected readonly idToUserMap = computed(
    () =>
      this.userEntries()
        .filter((ii) => ii.id)
        .reduce<Record<string, DbUser>>((acc, ii) => ({...acc, [ii.id!]: ii}), {}),
    {equal: jsonEqual},
  );

  protected readonly qualiToUsersMap = computed(
    () => {
      const users = this.userEntries();
      const testUsers = users.filter((uu) => !!uu.id && uu.qualification === DbUserQualification.Test);

      return Object.values(DbUserQualification)
        .filter((ii) => ii !== DbUserQualification.Test)
        .reduce<Record<DbUserQualification, DbUser[]>>(
          (acc, quali) => ({...acc, [quali]: [...users.filter((uu) => !!uu.id && uu.qualification === quali), ...testUsers]}),
          {} as Record<DbUserQualification, DbUser[]>,
        );
    },
    {equal: jsonEqual},
  );
}
