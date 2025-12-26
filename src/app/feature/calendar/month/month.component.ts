import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, EventEmitter, input, Input, Output} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {jsonEqual} from 'dd-rxjs';
import {DbCalendar, DbUserAvailability, userAvailabilitiesGerman, userAvailabilitiesOrdered} from 'src/app/data/db';
import {IsWeekendPipe} from 'src/app/shared/is-weekend';
import {ToHolidayPipe} from 'src/app/shared/to-holiday';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IsWeekendPipe, MatIconModule, MatTooltipModule, ToHolidayPipe],
})
export class MonthComponent {
  readonly calendar = input<DbCalendar[] | null | undefined>(undefined);

  @Input() dateMonth?: string | null;
  @Input() days?: string[] | null;

  @Output() readonly changeAvailability = new EventEmitter<{date: string; value: DbUserAvailability | null}>();

  protected readonly DbUserAvailability = DbUserAvailability;
  protected readonly availabilities = userAvailabilitiesOrdered;
  protected readonly userAvailabilitiesGerman = userAvailabilitiesGerman;

  protected readonly dbEntries = computed(
    () =>
      (this.calendar() ?? []).reduce<Record<string, DbCalendar | undefined>>((acc, ii) => ({...acc, [`${ii.day}T00:00:00.000`]: ii}), {}),
    {equal: jsonEqual},
  );

  protected readonly setAvailability = (date: string, value: DbUserAvailability | null) => this.changeAvailability.emit({date, value});
}
