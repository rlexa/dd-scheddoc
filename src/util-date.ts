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
