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

export interface DbUser {
  group?: DbUserGroup | null;
  id?: string | null;
  name?: string | null;
  qualification?: DbUserQualification | null;
}

export const qualificationsGerman: Record<DbUserQualification, string> = {
  [DbUserQualification.EmergencyRoom]: 'Notaufnahme',
  [DbUserQualification.IntensiveCareUnit]: 'Intensivstation',
  [DbUserQualification.SeniorPhysician]: 'Oberarzt',
  [DbUserQualification.Test]: 'Test',
  [DbUserQualification.ThirdService]: '3. Dienst',
};
