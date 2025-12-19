import { YouthMember } from './types';

const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Lucas', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Elijah', 'Harper', 'William', 'Evelyn', 'Alexander'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateMockMembers(count: number): YouthMember[] {
  const members: YouthMember[] = [];
  const now = new Date();
  const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const birthYear = now.getFullYear() - (13 + Math.floor(Math.random() * 12));
    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = 1 + Math.floor(Math.random() * 28);
    const registrationDate = randomDate(yearAgo, now);

    members.push({
      id: `member-${i + 1}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      dateOfBirth: new Date(birthYear, birthMonth, birthDay).toISOString().split('T')[0],
      gender: Math.random() > 0.5 ? 'male' : 'female',
      address: `${Math.floor(Math.random() * 9999) + 1} Main Street, City, State`,
      registrationDate: registrationDate.toISOString().split('T')[0],
      parentName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastName}`,
      parentPhone: `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      notes: Math.random() > 0.7 ? 'Active participant in choir' : undefined,
    });
  }

  return members.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
}

export const mockMembers = generateMockMembers(85);

export function getStoredMembers(): YouthMember[] {
  const stored = localStorage.getItem('youthMembers');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('youthMembers', JSON.stringify(mockMembers));
  return mockMembers;
}

export function saveMembers(members: YouthMember[]) {
  localStorage.setItem('youthMembers', JSON.stringify(members));
}

export function addMember(member: Omit<YouthMember, 'id'>) {
  const members = getStoredMembers();
  const newMember: YouthMember = {
    ...member,
    id: `member-${Date.now()}`,
  };
  members.unshift(newMember);
  saveMembers(members);
  return newMember;
}
