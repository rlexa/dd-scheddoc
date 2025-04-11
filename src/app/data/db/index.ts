export enum DbUserGroup {
  Admin = 'admin',
  User = 'user',
}

export enum DbUserQualification {
  EmergencyRoom = 'EmergencyRoom',
  IntensiveCareUnit = 'IntensiveCareUnit',
  SeniorPhysician = 'SeniorPhysician',
  Test = 'Test',
  /** Only for weekends and holidays */
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
  /** Created manually as user candidate. */
  isManual?: boolean | null;
  name?: string | null;
  qualification?: DbUserQualification | null;
}

export type DbUserKey = keyof DbUser;

export interface DbCalendar {
  availability?: DbUserAvailability | null;
  day?: string | null;
  frozenAs?: DbUserQualification | null;
  id?: string | null;
  user?: string | null;
}

export type DbCalendarKey = keyof DbCalendar;

// #region constants

export const collectionCalendar = 'calendar';
export const collectionUser = 'user';

export const qualificationsOrdered: DbUserQualification[] = [
  DbUserQualification.IntensiveCareUnit,
  DbUserQualification.EmergencyRoom,
  DbUserQualification.ThirdService,
  DbUserQualification.SeniorPhysician,
];

export const qualificationsOrderedForAutoAssignment: DbUserQualification[] = [
  DbUserQualification.SeniorPhysician,
  DbUserQualification.IntensiveCareUnit,
  DbUserQualification.EmergencyRoom,
  DbUserQualification.ThirdService,
];

export const qualificationsGerman: Record<DbUserQualification, string> = {
  [DbUserQualification.EmergencyRoom]: 'Notaufnahme',
  [DbUserQualification.IntensiveCareUnit]: 'Intensivstation',
  [DbUserQualification.SeniorPhysician]: 'Rufdienst',
  [DbUserQualification.Test]: 'Test',
  [DbUserQualification.ThirdService]: '3. Dienst',
};

const qualificationEligibles: Record<DbUserQualification, DbUserQualification[]> = {
  [DbUserQualification.EmergencyRoom]: [DbUserQualification.Test, DbUserQualification.EmergencyRoom],
  [DbUserQualification.IntensiveCareUnit]: [
    DbUserQualification.Test,
    DbUserQualification.EmergencyRoom,
    DbUserQualification.IntensiveCareUnit,
  ],
  [DbUserQualification.SeniorPhysician]: [DbUserQualification.Test, DbUserQualification.SeniorPhysician],
  [DbUserQualification.Test]: [DbUserQualification.Test],
  [DbUserQualification.ThirdService]: [
    DbUserQualification.Test,
    DbUserQualification.EmergencyRoom,
    DbUserQualification.IntensiveCareUnit,
    DbUserQualification.ThirdService,
  ],
};

export const isQualificationEligible = (qualification: DbUserQualification | null | undefined, target: DbUserQualification) =>
  !!qualification && qualificationEligibles[target].includes(qualification);

export const userAvailabilitiesOrdered: DbUserAvailability[] = [
  DbUserAvailability.Must,
  DbUserAvailability.Want,
  DbUserAvailability.Can,
  DbUserAvailability.Wont,
  DbUserAvailability.Cant,
  DbUserAvailability.None,
];

export const userAvailabilitiesOrderedForCandidates: DbUserAvailability[] = [
  DbUserAvailability.Must,
  DbUserAvailability.Want,
  DbUserAvailability.Can,
  DbUserAvailability.None,
  DbUserAvailability.Wont,
  DbUserAvailability.Cant,
];

export const userAvailabilitiesGerman: Record<DbUserAvailability, string> = {
  [DbUserAvailability.Can]: 'Kann',
  [DbUserAvailability.Cant]: 'Nein',
  [DbUserAvailability.Must]: 'Muss',
  [DbUserAvailability.None]: 'Egal',
  [DbUserAvailability.Want]: 'Will',
  [DbUserAvailability.Wont]: 'Will nicht',
};

export const isConsideredSameAvailability = (aaAvail: DbUserAvailability, bbAvail: DbUserAvailability) =>
  aaAvail === bbAvail ||
  ([DbUserAvailability.None, DbUserAvailability.Can].includes(aaAvail) &&
    [DbUserAvailability.None, DbUserAvailability.Can].includes(bbAvail));
