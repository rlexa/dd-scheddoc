import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, Input, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DbCalendar, DbUserAvailability, userAvailabilitiesGerman} from 'src/app/data/db';
import {ToHolidayPipe} from 'src/app/shared/to-holiday';
import {jsonEqual, strPadStartWithZero2, strPadStartWithZero4} from 'src/util';
import {IsWeekendPipe} from './is-weekend.pipe';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IsWeekendPipe, MatIconModule, MatTooltipModule, ToHolidayPipe],
})
export class MonthComponent {
  private readonly calendarEntries = signal<DbCalendar[]>([], {equal: jsonEqual});
  private readonly dateOfMonth = signal<string | null>(null);

  @Input() set dateMonth(val: string | null | undefined) {
    this.dateOfMonth.set(val ?? null);
  }

  @Input() set calendar(val: DbCalendar[] | null | undefined) {
    this.calendarEntries.set(val ?? []);
  }

  protected readonly DbUserAvailability = DbUserAvailability;
  protected readonly availabilities: DbUserAvailability[] = [
    DbUserAvailability.Must,
    DbUserAvailability.Want,
    DbUserAvailability.Can,
    DbUserAvailability.Wont,
    DbUserAvailability.Cant,
    DbUserAvailability.None,
  ];
  protected readonly userAvailabilitiesGerman = userAvailabilitiesGerman;

  protected readonly days = computed(
    () => {
      const date = this.dateOfMonth();
      if (!date) {
        return [] as string[];
      }

      const dateMonth = new Date(date);
      const year = strPadStartWithZero4(dateMonth.getFullYear().toString());
      const month = strPadStartWithZero2((dateMonth.getMonth() + 1).toString());
      dateMonth.setMonth(dateMonth.getMonth() + 1);
      dateMonth.setDate(1);
      dateMonth.setDate(dateMonth.getDate() - 1);
      const max = dateMonth.getDate();
      return new Array(max).fill('').map((_, index) => `${year}-${month}-${strPadStartWithZero2((index + 1).toString())}T00:00:00.000`);
    },
    {equal: jsonEqual},
  );

  protected readonly dbEntries = computed(
    () => this.calendarEntries().reduce<Record<string, DbCalendar>>((acc, ii) => ({...acc, [`${ii.day}T00:00:00.000`]: ii}), {}),
    {equal: jsonEqual},
  );
}
