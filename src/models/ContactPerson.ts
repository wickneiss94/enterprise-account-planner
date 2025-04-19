export interface ContactPerson {
  id: string;
  name: string;
  title: string;
  email: string;
  phone?: string;
  role: 'Decision Maker' | 'Influencer' | 'User' | 'Technical Contact';
  notes?: string;
  lastContactDate?: Date;
} 