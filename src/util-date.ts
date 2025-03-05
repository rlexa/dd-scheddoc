export const msSecond = 1_000;
export const msMinute = 60 * msSecond;
export const msHour = 60 * msMinute;
export const msDay = 24 * msHour;
export const msWeek = 7 * msDay;

export const toDate = (val: Date | string | number) => new Date(val);
export const dateToIso = (val: Date | string | number) => toDate(val).toISOString();
