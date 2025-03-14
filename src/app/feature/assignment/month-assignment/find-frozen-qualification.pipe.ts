import {Pipe, PipeTransform} from '@angular/core';
import {DbCalendar, DbUser, DbUserQualification} from 'src/app/data/db';

@Pipe({name: 'findFrozenQualification', pure: true})
export class FindFrozenQualificationPipe implements PipeTransform {
  transform(users: DbUser[], calendars: DbCalendar[], qualification: DbUserQualification) {
    return users.find((user) => calendars.some((cc) => cc.user === user.id && cc.frozenAs === qualification));
  }
}
