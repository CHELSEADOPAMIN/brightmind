export type DoctorGender = 'all' | 'male' | 'female';
export type DoctorSpecialty = 'general' | 'anxiety' | 'depression' | 'trauma' | 'relationship';
export type BillingFilter = 'all' | 'yes' | 'no';

export type DoctorRecord = {
  id: string;
  name: string;
  title: string;
  gender: Exclude<DoctorGender, 'all'>;
  specialties: DoctorSpecialty[];
  distanceKm: number;
  rating: number;
  reviewCount: number;
  latitude: number;
  longitude: number;
  suburb: string;
  languages: string[];
  bulkBilling: boolean;
  bio: string;
  availability: string[];
  phone: string;
};

export type DoctorFilters = {
  gender: DoctorGender;
  specialty: DoctorSpecialty | 'all';
  billing: BillingFilter;
};
