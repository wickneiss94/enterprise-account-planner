import axios from 'axios';
import { ContactPerson } from '../models/ContactPerson';
import { Opportunity } from '../models/Opportunity';
import { Initiative } from '../models/Initiative';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Contacts API
export const contactsApi = {
  getAll: async (): Promise<ContactPerson[]> => {
    const response = await api.get('/contacts');
    return response.data;
  },

  getByInitiative: async (initiativeId: string): Promise<ContactPerson[]> => {
    const response = await api.get(`/initiatives/${initiativeId}/contacts`);
    return response.data;
  },

  getById: async (id: string): Promise<ContactPerson> => {
    const response = await api.get(`/contacts/${id}`);
    return response.data;
  },

  create: async (contact: Omit<ContactPerson, 'id'>): Promise<ContactPerson> => {
    const response = await api.post('/contacts', contact);
    return response.data;
  },

  update: async (id: string, contact: Partial<ContactPerson>): Promise<ContactPerson> => {
    const response = await api.patch(`/contacts/${id}`, contact);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/contacts/${id}`);
  },
};

// Opportunities API
export const opportunitiesApi = {
  getAll: async (): Promise<Opportunity[]> => {
    const response = await api.get('/opportunities');
    return response.data;
  },

  getByInitiative: async (initiativeId: string): Promise<Opportunity[]> => {
    const response = await api.get(`/initiatives/${initiativeId}/opportunities`);
    return response.data;
  },

  getById: async (id: string): Promise<Opportunity> => {
    const response = await api.get(`/opportunities/${id}`);
    return response.data;
  },

  create: async (opportunity: Omit<Opportunity, 'id' | 'lastUpdated'>): Promise<Opportunity> => {
    const response = await api.post('/opportunities', {
      ...opportunity,
      lastUpdated: new Date(),
    });
    return response.data;
  },

  update: async (id: string, opportunity: Partial<Opportunity>): Promise<Opportunity> => {
    const response = await api.patch(`/opportunities/${id}`, {
      ...opportunity,
      lastUpdated: new Date(),
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/opportunities/${id}`);
  },
};

// Initiatives API
export const initiativesApi = {
  getAll: async (): Promise<Initiative[]> => {
    const response = await api.get('/initiatives');
    return response.data;
  },

  getByAccount: async (accountId: string): Promise<Initiative[]> => {
    const response = await api.get(`/accounts/${accountId}/initiatives`);
    return response.data;
  },

  getById: async (id: string): Promise<Initiative> => {
    const response = await api.get(`/initiatives/${id}`);
    return response.data;
  },

  create: async (initiative: Omit<Initiative, 'id' | 'lastUpdated'>): Promise<Initiative> => {
    const response = await api.post('/initiatives', {
      ...initiative,
      lastUpdated: new Date(),
    });
    return response.data;
  },

  update: async (id: string, initiative: Partial<Initiative>): Promise<Initiative> => {
    const response = await api.patch(`/initiatives/${id}`, {
      ...initiative,
      lastUpdated: new Date(),
    });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/initiatives/${id}`);
  },

  // Relationship management
  addContact: async (initiativeId: string, contactId: string): Promise<void> => {
    await api.post(`/initiatives/${initiativeId}/contacts/${contactId}`);
  },

  removeContact: async (initiativeId: string, contactId: string): Promise<void> => {
    await api.delete(`/initiatives/${initiativeId}/contacts/${contactId}`);
  },

  addOpportunity: async (initiativeId: string, opportunityId: string): Promise<void> => {
    await api.post(`/initiatives/${initiativeId}/opportunities/${opportunityId}`);
  },

  removeOpportunity: async (initiativeId: string, opportunityId: string): Promise<void> => {
    await api.delete(`/initiatives/${initiativeId}/opportunities/${opportunityId}`);
  },
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
      throw new Error('Network error - please check your connection');
    } else {
      // Error in request configuration
      console.error('Request Error:', error.message);
      throw new Error('Request configuration error');
    }
  }
);

export default api; 