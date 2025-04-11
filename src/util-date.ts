import {getHolidayByDate} from 'feiertagejs';
import {strPadStartWithZero2, strPadStartWithZero4} from './util';

export const msSecond = 1_000;
export const msMinute = 60 * msSecond;
export const msHour = 60 * msMinute;
export const msDay = 24 * msHour;
export const msWeek = 7 * msDay;

/** **fyi**: dates without timezone are created as if in local timezone */
export function asDate(val: Date | string | number): Date;
export function asDate(val: Date | string | number | null): Date | null;
export function asDate(val: unknown) {
  if (val instanceof Date) {
    return val;
  }

  if (typeof val === 'number') {
    return new Date(val);
  }

  if (typeof val === 'string') {
    // !!! without 'T' new Date(val) would create it assuming UTC but we want assumption of local timezone
    return new Date(val.includes('T') ? val : `${val}T00:00:00.000`);
  }

  return null;
}

export const dateToYearPart = (from: Date | string | number) => `${strPadStartWithZero4(asDate(from).getFullYear().toString())}`;
export const dateToMonthPart = (from: Date | string | number) => `${strPadStartWithZero2((asDate(from).getMonth() + 1).toString())}`;
export const dateToDayPart = (from: Date | string | number) => `${strPadStartWithZero2(asDate(from).getDate().toString())}`;

export const dateToDatePart = (from: Date | string | number) => `${dateToYearPart(from)}-${dateToMonthPart(from)}-${dateToDayPart(from)}`;

export const dateToStartOfMonth = (from: Date | string | number) =>
  asDate(`${dateToYearPart(from)}-${dateToMonthPart(from)}-01T00:00:00.000`);
export const dateToStartOfMonthDatePart = (from: Date | string | number) => dateToDatePart(dateToStartOfMonth(from));

export function dateToEndOfMonth(from: Date | string | number) {
  const val = asDate(from);
  val.setMonth(val.getMonth() + 1);
  val.setDate(1);
  val.setDate(val.getDate() - 1);
  return asDate(`${dateToDatePart(val)}T23:59:59.999`);
}
export const dateToEndOfMonthDatePart = (from: Date | string | number) => dateToDatePart(dateToEndOfMonth(from));

export const isWeekend = (val: Date | string | number) => [0, 6].includes(asDate(val).getDay());

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
    (ii) => `${strPadStartWithZero4(ii.getFullYear().toString())}-${strPadStartWithZero2((ii.getMonth() + 1).toString())}T00:00:00.000`,
  );
}

/** Returns `yyyy-mm-ddT00:00:00.000` array with all days in a month. */
export function generateDaysOfMonth(date: Date) {
  if (!date) {
    return [] as string[];
  }

  const dateMonth = new Date(date);
  const year = strPadStartWithZero4(dateMonth.getFullYear().toString());
  const month = strPadStartWithZero2((dateMonth.getMonth() + 1).toString());
  dateMonth.setMonth(dateMonth.getMonth() + 1);
  dateMonth.setDate(1);
  dateMonth.setDate(dateMonth.getDate() - 1);
  const max = dateMonth.getDate();
  return new Array(max).fill('').map((_, index) => `${year}-${month}-${strPadStartWithZero2((index + 1).toString())}T00:00:00.000`);
}

// #region 3rd party

export const getHoliday = (value: string | Date | number) => getHolidayByDate(asDate(value), 'HE')?.translate('de');
