import {Pipe, PipeTransform} from '@angular/core';
import {DbCalendar, DbUser} from 'src/app/data/db';

@Pipe({name: 'userCalendar', pure: true})
export class UserCalendarPipe implements PipeTransform {
  transform(user: DbUser, calendars: DbCalendar[]) {
    return calendars.find((cc) => cc.user === user.id);
  }
}
