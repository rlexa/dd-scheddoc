import {Pipe, PipeTransform} from '@angular/core';
import {DbCalendar, DbUser, DbUserQualification} from 'src/app/data/db';
import {findFrozenQualification} from 'src/util-business';

@Pipe({name: 'findFrozenQualification', pure: true})
export class FindFrozenQualificationPipe implements PipeTransform {
  transform(users: DbUser[], calendars: DbCalendar[], qualification: DbUserQualification) {
    return findFrozenQualification(users, calendars, qualification);
  }
}
