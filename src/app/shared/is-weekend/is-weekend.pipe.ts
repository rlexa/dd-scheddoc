import {Pipe, PipeTransform} from '@angular/core';
import {isWeekend} from 'src/util-date';

@Pipe({name: 'isWeekend', pure: true})
export class IsWeekendPipe implements PipeTransform {
  transform(value: string | Date | number) {
    return isWeekend(value);
  }
}
