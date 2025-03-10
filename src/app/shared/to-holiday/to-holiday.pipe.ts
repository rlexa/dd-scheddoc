import {Pipe, PipeTransform} from '@angular/core';
import {getHolidayByDate} from 'feiertagejs';
import {asDate} from 'src/util-date';

@Pipe({name: 'toHoliday', pure: true})
export class ToHolidayPipe implements PipeTransform {
  transform(value: string | Date | number) {
    return getHolidayByDate(asDate(value), 'HE')?.translate('de');
  }
}
