import {Pipe, PipeTransform} from '@angular/core';
import {asDate} from 'src/util-date';

@Pipe({name: 'isWeekend', pure: true})
export class IsWeekendPipe implements PipeTransform {
  transform(value: string | Date | number) {
    return [0, 6].includes(asDate(value).getDay());
  }
}
