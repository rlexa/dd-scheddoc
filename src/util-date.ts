import {
  asDate,
  asDateNonNull,
  dateEndOfLocalMonth,
  dateToLocalDatePart,
  dateToLocalDateString,
  dateToLocalMonthString,
  dateToLocalYearString,
  isWeekendDay,
} from 'dd-nodom/date';
import {compose} from 'dd-nodom/fp';
import {strPadLeftWithZero2, strPadLeftWithZero4} from 'dd-nodom/str';
import {getHolidayByDate} from 'feiertagejs';

export const dateToYearPart = compose(dateToLocalYearString, asDateNonNull);
export const dateToMonthPart = compose(dateToLocalMonthString, asDateNonNull);
export const dateToDayPart = compose(dateToLocalDateString, asDateNonNull);

export const dateToStartOfMonth = (from: Date | string | number) =>
  asDate(`${dateToYearPart(from)}-${dateToMonthPart(from)}-01T00:00:00.000`);
export const dateToStartOfMonthDatePart = compose(dateToLocalDatePart, dateToStartOfMonth);

export const dateToEndOfMonthDatePart = compose(dateToLocalDatePart, dateEndOfLocalMonth, asDateNonNull);

export const isWeekend = (val: Date | string | number) => isWeekendDay(asDate(val).getDay());

/** Returns `yyyy-mm-ddT00:00:00.000` array around the current month at index 1. */
export function generateCurrentMonths() {
  const now = new Date();
  const next0 = new Date(now);
  next0.setMonth(now.getMonth() + 1);
  const next1 = new Date(now);
  next1.setMonth(now.getMonth() + 2);
  const next2 = new Date(now);
  next2.setMonth(now.getMonth() + 3);

  return [now, next0, next1, next2].map(
    (ii) => `${strPadLeftWithZero4(ii.getFullYear().toString())}-${strPadLeftWithZero2((ii.getMonth() + 1).toString())}T00:00:00.000`,
  );
}

/** Returns `yyyy-mm-ddT00:00:00.000` array with all days in a month. */
export function generateDaysOfMonth(date: Date) {
  if (!date) {
    return [] as string[];
  }

  const dateMonth = new Date(date);
  const year = strPadLeftWithZero4(dateMonth.getFullYear().toString());
  const month = strPadLeftWithZero2((dateMonth.getMonth() + 1).toString());
  dateMonth.setMonth(dateMonth.getMonth() + 1);
  dateMonth.setDate(1);
  dateMonth.setDate(dateMonth.getDate() - 1);
  const max = dateMonth.getDate();
  return new Array(max).fill('').map((_, index) => `${year}-${month}-${strPadLeftWithZero2((index + 1).toString())}T00:00:00.000`);
}

// #region 3rd party

export const getHoliday = (value: string | Date | number) => getHolidayByDate(asDate(value), 'HE')?.translate('de');
