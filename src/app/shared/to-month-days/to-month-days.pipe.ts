import {Pipe, PipeTransform} from '@angular/core';
import {asDate, generateDaysOfMonth} from 'src/util-date';

@Pipe({name: 'toMonthDays', pure: true})
export class ToMonthDaysPipe implements PipeTransform {
  transform(value: Date | string | number | null | undefined) {
    return !value ? [] : generateDaysOfMonth(asDate(value));
  }
}
