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
