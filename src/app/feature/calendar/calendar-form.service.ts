import {Injectable} from '@angular/core';
import {jsonCopy} from 'dd-nodom/lib/common';
import {DbCalendar, DbUserAvailability} from 'src/app/data/db';
import {ObjectFormService} from 'src/app/shared/object-form-service';
import {dateToDatePart} from 'src/util-date';

@Injectable()
export class CalendarFormService extends ObjectFormService<DbCalendar[]> {
  setAvailability(user: string, date: string, value: DbUserAvailability | null) {
    const day = dateToDatePart(date);
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
