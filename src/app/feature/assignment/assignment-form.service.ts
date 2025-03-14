import {Injectable} from '@angular/core';
import {DbCalendar, DbUserAvailability, DbUserQualification} from 'src/app/data/db';
import {ObjectFormService} from 'src/app/shared/object-form-service';
import {jsonCopy} from 'src/util';
import {dateToDatePart} from 'src/util-date';

@Injectable()
export class AssignmentFormService extends ObjectFormService<DbCalendar[]> {
  changeFreeze(date: string, quali: DbUserQualification, user: string | null) {
    const day = dateToDatePart(date);
    const val = jsonCopy(this.model$.value);

    if (!user) {
      const prepared = val
        // unfreeze day's qualification
        ?.map((ii) => (ii.day === day && ii.frozenAs === quali ? {...ii, frozenAs: null} : ii))
        // delete possibly unsaved entries created due to previous freeze which are now unfrozen
        .filter((ii) => ii.day !== day || ii.id || ii.frozenAs);

      this.model$.next(prepared);
    } else {
      // unfreeze day's qualification of other users and freeze current user
      const prepared = val?.map((ii) => {
        if (ii.day !== day) {
          return ii;
        }

        if (ii.user === user && ii.frozenAs !== quali) {
          return {...ii, frozenAs: quali};
        }

        if (ii.user !== user && ii.frozenAs === quali) {
          return {...ii, frozenAs: null};
        }

        return ii;
      });

      // add frozen user in case there was no entry due to "none" availability selection
      if (!prepared?.find((ii) => ii.day === day && ii.user === user && ii.frozenAs === quali)) {
        prepared?.push({availability: DbUserAvailability.None, day, frozenAs: quali, user});
      }

      this.model$.next(prepared);
    }
  }
}
