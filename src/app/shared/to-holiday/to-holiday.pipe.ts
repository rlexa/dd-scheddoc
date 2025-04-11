import {Pipe, PipeTransform} from '@angular/core';
import {getHoliday} from 'src/util-date';

@Pipe({name: 'toHoliday', pure: true})
export class ToHolidayPipe implements PipeTransform {
  transform(value: string | Date | number) {
    return getHoliday(value);
  }
}
