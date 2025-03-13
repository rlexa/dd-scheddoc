import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DbCalendar, DbUserAvailability, userAvailabilitiesGerman, userAvailabilitiesOrdered} from 'src/app/data/db';
import {IsWeekendPipe} from 'src/app/shared/is-weekend';
import {ToHolidayPipe} from 'src/app/shared/to-holiday';
import {jsonEqual} from 'src/util';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IsWeekendPipe, MatIconModule, MatTooltipModule, ToHolidayPipe],
})
export class MonthComponent {
  private readonly calendarEntries = signal<DbCalendar[]>([], {equal: jsonEqual});

  @Input() dateMonth?: string | null;
  @Input() days?: string[] | null;

  @Input() set calendar(val: DbCalendar[] | null | undefined) {
    this.calendarEntries.set(val ?? []);
  }

  @Output() readonly changeAvailability = new EventEmitter<{date: string; value: DbUserAvailability | null}>();

  protected readonly DbUserAvailability = DbUserAvailability;
  protected readonly availabilities = userAvailabilitiesOrdered;
  protected readonly userAvailabilitiesGerman = userAvailabilitiesGerman;

  protected readonly dbEntries = computed(
    () =>
      this.calendarEntries().reduce<Record<string, DbCalendar | undefined>>((acc, ii) => ({...acc, [`${ii.day}T00:00:00.000`]: ii}), {}),
    {equal: jsonEqual},
  );

  protected readonly setAvailability = (date: string, value: DbUserAvailability | null) => this.changeAvailability.emit({date, value});
}
