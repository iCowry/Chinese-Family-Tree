
export enum Gender {
  Male = 'male',
  Female = 'female'
}

export interface Junwang {
  name: string;
  region: string;
  description: string;
}

export interface Tanghao {
  id: string;
  name: string;
  region: string;
  year: string;
  origin: string;
  couplet: string;
}

export interface Surname {
  id: string;
  name: string;
  origin: string;
  junwangs: Junwang[];
  tanghao: Tanghao[];
}

export interface FamilyEvent {
  year: string;
  title: string;
  description: string;
}

export interface Family {
  id: string;
  name: string;
  surnameId: string;
  tanghaoId: string;
  founder: string;
  origin: string;
  description: string;
  creatorId: string;
  
  // New Extended Fields
  zibei?: string;         // 字辈/派语
  motto?: string;         // 家训
  migration?: string;     // 迁徙记录
  events?: FamilyEvent[]; // 大事记
}

export interface Member {
  id: string;
  familyId: string;
  name: string;
  gender: Gender;
  generation: number;
  fatherId?: string | null;
  motherId?: string | null;
  spouseIds: string[];
  birthDate: string;
  deathDate?: string;
  bio: string;
  photo?: string;
}

export interface AppData {
  surnames: Surname[];
  families: Family[];
  members: Member[];
}
