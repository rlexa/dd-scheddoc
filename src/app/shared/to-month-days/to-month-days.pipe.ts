import {Pipe, PipeTransform} from '@angular/core';
import {asDate} from 'dd-nodom/date';
import {generateDaysOfMonth} from 'src/util-date';

@Pipe({name: 'toMonthDays', pure: true})
export class ToMonthDaysPipe implements PipeTransform {
  transform(value: Date | string | number | null | undefined) {
    return !value ? [] : generateDaysOfMonth(asDate(value));
  }
}
