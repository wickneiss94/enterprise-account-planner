import { db } from '../config/firebase';
import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  DocumentData
} from 'firebase/firestore';
import { ContactPerson } from './ContactPerson';
import { Opportunity } from './Opportunity';

export type AccountStatus = 'Active' | 'At Risk' | 'Prospect';
export type AccountPriority = 'High' | 'Medium' | 'Low';

export interface Account {
  id: string;
  name: string;
  ticker?: string;
  industry: string;
  arr: number;
  status: AccountStatus;
  priority: AccountPriority;
  transformationReadiness: boolean;
  lastUpdated: Date;
  notes?: string;
  contacts?: ContactPerson[];
  opportunities?: Opportunity[];
  expectedCloseDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Firestore collection references
const accountsCollection = collection(db, 'accounts');

// CRUD operations
export const getAccounts = async (): Promise<Account[]> => {
  const snapshot = await getDocs(accountsCollection);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      industry: data.industry,
      arr: data.arr,
      status: data.status as AccountStatus,
      priority: data.priority as AccountPriority,
      contacts: data.contacts,
      opportunities: data.opportunities,
      expectedCloseDate: data.expectedCloseDate?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    };
  });
};

export const getAccount = async (id: string): Promise<Account | null> => {
  const docSnap = await getDoc(doc(accountsCollection, id));
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name,
      industry: data.industry,
      arr: data.arr,
      status: data.status as AccountStatus,
      priority: data.priority as AccountPriority,
      contacts: data.contacts,
      opportunities: data.opportunities,
      expectedCloseDate: data.expectedCloseDate?.toDate(),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    };
  }
  
  return null;
};

export const createAccount = async (account: Omit<Account, 'id'>): Promise<string> => {
  const docRef = await addDoc(accountsCollection, {
    ...account,
    lastUpdated: new Date()
  });
  return docRef.id;
};

export const updateAccount = async (id: string, updates: Partial<Account>): Promise<void> => {
  const docRef = doc(db, 'accounts', id);
  await updateDoc(docRef, {
    ...updates,
    lastUpdated: new Date()
  });
};

export const deleteAccount = async (id: string): Promise<void> => {
  const docRef = doc(db, 'accounts', id);
  await deleteDoc(docRef);
};

// Query utilities
export const getAccountsByStatus = async (status: Account['status']): Promise<Account[]> => {
  const q = query(accountsCollection, where('status', '==', status));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    lastUpdated: doc.data().lastUpdated?.toDate(),
    expectedCloseDate: doc.data().expectedCloseDate?.toDate()
  })) as Account[];
};

export const getAccountsByPriority = async (priority: Account['priority']): Promise<Account[]> => {
  const q = query(accountsCollection, where('priority', '==', priority));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    lastUpdated: doc.data().lastUpdated?.toDate(),
    expectedCloseDate: doc.data().expectedCloseDate?.toDate()
  })) as Account[];
}; 