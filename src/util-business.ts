import {DbCalendar, DbUser, DbUserQualification} from './app/data/db';

export const findFrozenQualification = (users: DbUser[], calendars: DbCalendar[], qualification: DbUserQualification) =>
  users.find((user) => calendars.some((cc) => cc.user === user.id && cc.frozenAs === qualification));
