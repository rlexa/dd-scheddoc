import {Pipe, PipeTransform} from '@angular/core';
import {DbCalendar, DbUser} from 'src/app/data/db';

@Pipe({name: 'userFrozenEntriesCount', pure: true})
export class UserFrozenEntriesCountPipe implements PipeTransform {
  transform(user: DbUser, entries: DbCalendar[]) {
    return entries.filter((ii) => !!ii.frozenAs && ii.user === user.id).length;
  }
}
