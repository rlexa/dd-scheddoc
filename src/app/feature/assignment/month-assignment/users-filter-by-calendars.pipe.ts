import {Pipe, PipeTransform} from '@angular/core';
import {DbCalendar, DbUser, DbUserAvailability, userAvailabilitiesOrdered} from 'src/app/data/db';

@Pipe({name: 'usersFilterByCalendars', pure: true})
export class UsersFilterByCalendarsPipe implements PipeTransform {
  transform(value: DbUser[], calendars: DbCalendar[]) {
    return value
      .filter((user) => {
        const calendar = calendars.find((cc) => cc.user === user.id);
        return !calendar || calendar.availability !== DbUserAvailability.Cant;
      })
      .sort((aa, bb) => {
        const aaAvail = calendars.find((cc) => cc.user === aa.id)?.availability ?? DbUserAvailability.None;
        const bbAvail = calendars.find((cc) => cc.user === bb.id)?.availability ?? DbUserAvailability.None;
        return userAvailabilitiesOrdered.indexOf(aaAvail) - userAvailabilitiesOrdered.indexOf(bbAvail);
      });
  }
}
