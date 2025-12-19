export interface YouthMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  registrationDate: string;
  parentName?: string;
  parentPhone?: string;
  notes?: string;
}

export interface RegistrationStats {
  totalMembers: number;
  thisMonth: number;
  thisWeek: number;
  thisYear: number;
  monthlyData: { month: string; count: number }[];
  weeklyData: { week: string; count: number }[];
  genderDistribution: { name: string; value: number }[];
  ageDistribution: { range: string; count: number }[];
}
