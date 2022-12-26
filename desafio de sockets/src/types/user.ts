export interface User {
  uuid: string;
  name: string;
  birthDate: string;
}

export interface UserForUpdate {
  name?: string;
  birthDate?:string;
}

export interface UserForCreation {
  name: string;
  birthDate: string;
}
