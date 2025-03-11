export enum DbUserGroup {
  Admin = 'admin',
  User = 'user',
}

export enum DbUserQualification {
  EmergencyRoom = 'EmergencyRoom',
  IntensiveCareUnit = 'IntensiveCareUnit',
  SeniorPhysician = 'SeniorPhysician',
  Test = 'Test',
  ThirdService = 'ThirdService',
}

export enum DbUserAvailability {
  Can = 'Can',
  Cant = 'Cant',
  Must = 'Must',
  None = 'None',
  Want = 'Want',
  Wont = 'Wont',
}

export interface DbUser {
  group?: DbUserGroup | null;
  id?: string | null;
  name?: string | null;
  qualification?: DbUserQualification | null;
}

export type DbUserKey = keyof DbUser;

export interface DbCalendar {
  availability?: DbUserAvailability | null;
  day?: string | null;
  frozen?: boolean | null;
  id?: string | null;
  user?: string | null;
}

export type DbCalendarKey = keyof DbCalendar;

export const collectionCalendar = 'calendar';
export const collectionUser = 'user';

export const qualificationsGerman: Record<DbUserQualification, string> = {
  [DbUserQualification.EmergencyRoom]: 'Notaufnahme',
  [DbUserQualification.IntensiveCareUnit]: 'Intensivstation',
  [DbUserQualification.SeniorPhysician]: 'Oberarzt',
  [DbUserQualification.Test]: 'Test',
  [DbUserQualification.ThirdService]: '3. Dienst',
};

export const userAvailabilitiesGerman: Record<DbUserAvailability, string> = {
  [DbUserAvailability.Can]: 'Kann',
  [DbUserAvailability.Cant]: 'Nein',
  [DbUserAvailability.Must]: 'Muss',
  [DbUserAvailability.None]: 'Egal',
  [DbUserAvailability.Want]: 'Will',
  [DbUserAvailability.Wont]: 'Will nicht',
};
