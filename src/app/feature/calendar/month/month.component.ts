import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, Input, signal} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DbUserAvailability, userAvailabilitiesGerman} from 'src/app/data/db';
import {ToHolidayPipe} from 'src/app/shared/to-holiday';
import {strPadStartWithZero2, strPadStartWithZero4} from 'src/util';
import {IsWeekendPipe} from './is-weekend.pipe';

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IsWeekendPipe, MatIconModule, MatTooltipModule, ToHolidayPipe],
})
export class MonthComponent {
  private readonly dateOfMonth = signal<string | null>(null);

  @Input() set dateMonth(val: string | null | undefined) {
    this.dateOfMonth.set(val ?? null);
  }

  protected readonly DbUserAvailability = DbUserAvailability;
  protected readonly availabilities: DbUserAvailability[] = [
    DbUserAvailability.None,
    DbUserAvailability.No,
    DbUserAvailability.Yes,
    DbUserAvailability.Must,
  ];
  protected readonly userAvailabilitiesGerman = userAvailabilitiesGerman;

  protected readonly days = computed(() => {
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
  });
}
