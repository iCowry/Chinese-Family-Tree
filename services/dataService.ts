import { AppData, Surname, Family, Member, Gender } from '../types';
import { INITIAL_DATA } from '../constants';

const STORAGE_KEY = 'genealogy_app_data';

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize if empty
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  return INITIAL_DATA;
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const DataService = {
  getSurnames: (): Surname[] => loadData().surnames,
  saveSurname: (surname: Surname) => {
    const data = loadData();
    const index = data.surnames.findIndex(s => s.id === surname.id);
    if (index >= 0) {
      data.surnames[index] = surname;
    } else {
      data.surnames.push(surname);
    }
    saveData(data);
  },
  deleteSurname: (id: string) => {
    const data = loadData();
    data.surnames = data.surnames.filter(s => s.id !== id);
    saveData(data);
  },
  
  getFamilies: (): Family[] => loadData().families,
  saveFamily: (family: Family) => {
    const data = loadData();
    const index = data.families.findIndex(f => f.id === family.id);
    if (index >= 0) {
      data.families[index] = family;
    } else {
      data.families.push(family);
    }
    saveData(data);
  },
  deleteFamily: (id: string) => {
    const data = loadData();
    data.families = data.families.filter(f => f.id !== id);
    // Also cascade delete members? Implementation choice: prompt usually asks for confirmation first
    data.members = data.members.filter(m => m.familyId !== id);
    saveData(data);
  },

  getMembers: (): Member[] => loadData().members,
  saveMember: (member: Member) => {
    const data = loadData();
    const index = data.members.findIndex(m => m.id === member.id);
    if (index >= 0) {
      data.members[index] = member;
    } else {
      data.members.push(member);
    }
    saveData(data);
  },
  deleteMember: (id: string) => {
    const data = loadData();
    data.members = data.members.filter(m => m.id !== id);
    // Remove references
    data.members.forEach(m => {
      if (m.fatherId === id) m.fatherId = null;
      if (m.motherId === id) m.motherId = null;
      m.spouseIds = m.spouseIds.filter(sid => sid !== id);
    });
    saveData(data);
  },
  
  // Helpers
  generateId: (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
};