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
  Must = 'Must',
  No = 'No',
  None = 'None',
  Yes = 'Yes',
}

export interface DbUser {
  group?: DbUserGroup | null;
  id?: string | null;
  name?: string | null;
  qualification?: DbUserQualification | null;
}

export const collectionUser = 'user';

export const qualificationsGerman: Record<DbUserQualification, string> = {
  [DbUserQualification.EmergencyRoom]: 'Notaufnahme',
  [DbUserQualification.IntensiveCareUnit]: 'Intensivstation',
  [DbUserQualification.SeniorPhysician]: 'Oberarzt',
  [DbUserQualification.Test]: 'Test',
  [DbUserQualification.ThirdService]: '3. Dienst',
};

export const userAvailabilitiesGerman: Record<DbUserAvailability, string> = {
  [DbUserAvailability.Must]: 'Muss',
  [DbUserAvailability.No]: 'Nein',
  [DbUserAvailability.None]: 'Egal',
  [DbUserAvailability.Yes]: 'Kann',
};
