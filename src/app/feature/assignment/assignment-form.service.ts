import {Injectable} from '@angular/core';
import {jsonCopy} from 'dd-nodom/lib/common';
import {
  DbCalendar,
  DbUser,
  DbUserAvailability,
  DbUserQualification,
  isConsideredSameAvailability,
  isQualificationEligible,
  qualificationsOrderedForAutoAssignment,
  userAvailabilitiesOrderedForCandidates,
} from 'src/app/data/db';
import {ObjectFormService} from 'src/app/shared/object-form-service';
import {Environment} from 'src/environments/environment';
import {dateToDatePart, getHoliday, isWeekend} from 'src/util-date';

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

  clearAll() {
    const prepared = jsonCopy(this.model$.value) ?? [];
    const withRemovedNewEntries = prepared.filter((entry) => entry.id);
    withRemovedNewEntries.forEach((entry) => {
      if (entry.frozenAs) {
        entry.frozenAs = null;
      }
    });
    this.model$.next(withRemovedNewEntries);
  }

  tryCalculateAssignments(days: string[], users: DbUser[]) {
    const prepared = jsonCopy(this.model$.value) ?? [];

    const userWorkingDays = prepared.reduce(
      (acc, ii) => {
        if (ii.frozenAs && ii.user && ii.user in acc) {
          ++acc[ii.user];
        }
        return acc;
      },
      users.reduce<Record<string, number>>((acc, ii) => ({...acc, [ii.id!]: 0}), {}),
    );

    days.map(dateToDatePart).forEach((day) => {
      const isWeekendOrHoliday = isWeekend(day) || !!getHoliday(day);
      const todays = prepared.filter((ii) => ii.day === day);

      const getTodayUserEntry = (userId?: string | null) => todays.find((ii) => ii.user === userId);
      const getTodayUserAvailability = (userId?: string | null) => getTodayUserEntry(userId)?.availability ?? DbUserAvailability.None;

      qualificationsOrderedForAutoAssignment.forEach((quali) => {
        if (quali === DbUserQualification.ThirdService && !isWeekendOrHoliday) {
          return;
        }

        const usersQualified = (users ?? [])
          .filter((ii) => Environment.withTestUsers || ii.qualification !== DbUserQualification.Test)
          .filter((ii) => ii.id && isQualificationEligible(ii.qualification, quali));
        if (usersQualified.length) {
          const foundFrozen = todays.find((ii) => ii.frozenAs === quali && usersQualified.some((uu) => uu.id === ii.user));
          if (!foundFrozen) {
            const candidates = usersQualified
              .filter((ii) => {
                const todayUserEntry = getTodayUserEntry(ii.id);
                return !todayUserEntry || (!todayUserEntry.frozenAs && todayUserEntry.availability !== DbUserAvailability.Cant);
              })
              .sort((aa, bb) => {
                const aaAvail = getTodayUserAvailability(aa.id);
                const bbAvail = getTodayUserAvailability(bb.id);

                if (!isConsideredSameAvailability(aaAvail, bbAvail)) {
                  if (aaAvail === DbUserAvailability.Must) {
                    return -1;
                  } else if (bbAvail === DbUserAvailability.Must) {
                    return 1;
                  }

                  return userAvailabilitiesOrderedForCandidates.indexOf(aaAvail) - userAvailabilitiesOrderedForCandidates.indexOf(bbAvail);
                }

                return (userWorkingDays[aa.id!] ?? 0) - (userWorkingDays[bb.id!] ?? 0);
              });

            const candidate = candidates[0];
            if (candidate) {
              const entry = getTodayUserEntry(candidate.id);
              if (entry) {
                entry.frozenAs = quali;
              } else {
                prepared.push({availability: DbUserAvailability.None, day, frozenAs: quali, user: candidate.id});
              }
              ++userWorkingDays[candidate.id!];
            }
          }
        }
      });
    });

    this.model$.next(prepared);
  }
}
