export enum DbUserGroup {
  Admin = 'admin',
  User = 'user',
}

export interface DbUser {
  group?: DbUserGroup | null;
  id?: string | null;
  name?: string | null;
  qualification?: string | null;
}
