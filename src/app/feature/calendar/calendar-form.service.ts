import {Injectable} from '@angular/core';
import {jsonCopy} from 'dd-nodom/common';
import {asLocalDatePart} from 'dd-nodom/date';
import {DbCalendar, DbUserAvailability} from 'src/app/data/db';
import {ObjectFormService} from 'src/app/shared/object-form-service';

@Injectable()
export class CalendarFormService extends ObjectFormService<DbCalendar[]> {
  setAvailability(user: string, date: string, value: DbUserAvailability | null) {
    const day = asLocalDatePart(date);
    const val = jsonCopy(this.model$.value);
    const target = val?.find((ii) => ii.day === day);
    if (!value) {
      if (target) {
        this.model$.next(val?.filter((ii) => ii !== target));
      }
    } else {
      if (target) {
        if (!target.frozenAs) {
          target.availability = value;
          this.model$.next(val);
        }
      } else if (val) {
        this.model$.next(
          [...val, {availability: value, day, frozenAs: null, user}].sort((aa, bb) => (aa.day ?? '').localeCompare(bb.day ?? '')),
        );
      }
    }
  }
}
