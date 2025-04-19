import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ContactPerson } from '../models/ContactPerson';
import { Opportunity } from '../models/Opportunity';
import { Initiative } from '../models/Initiative';
import { contactsApi, opportunitiesApi, initiativesApi } from '../services/api';

interface ContactOpportunityContextType {
  contacts: ContactPerson[];
  opportunities: Opportunity[];
  initiatives: Initiative[];
  loading: boolean;
  error: string | null;
  addContact: (contact: Omit<ContactPerson, 'id'>) => Promise<void>;
  updateContact: (id: string, contact: Partial<ContactPerson>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'lastUpdated'>) => Promise<void>;
  updateOpportunity: (id: string, opportunity: Partial<Opportunity>) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;
  addInitiative: (initiative: Omit<Initiative, 'id' | 'lastUpdated'>) => Promise<void>;
  updateInitiative: (id: string, initiative: Partial<Initiative>) => Promise<void>;
  deleteInitiative: (id: string) => Promise<void>;
  addContactToInitiative: (initiativeId: string, contactId: string) => Promise<void>;
  removeContactFromInitiative: (initiativeId: string, contactId: string) => Promise<void>;
  addOpportunityToInitiative: (initiativeId: string, opportunityId: string) => Promise<void>;
  removeOpportunityFromInitiative: (initiativeId: string, opportunityId: string) => Promise<void>;
  getInitiativesByAccount: (accountId: string) => Promise<void>;
}

const ContactOpportunityContext = createContext<ContactOpportunityContextType | undefined>(undefined);

export const useContactOpportunity = () => {
  const context = useContext(ContactOpportunityContext);
  if (!context) {
    throw new Error('useContactOpportunity must be used within a ContactOpportunityProvider');
  }
  return context;
};

export const ContactOpportunityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contactsData, opportunitiesData, initiativesData] = await Promise.all([
          contactsApi.getAll(),
          opportunitiesApi.getAll(),
          initiativesApi.getAll(),
        ]);
        setContacts(contactsData);
        setOpportunities(opportunitiesData);
        setInitiatives(initiativesData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addContact = useCallback(async (contactData: Omit<ContactPerson, 'id'>) => {
    try {
      const newContact = await contactsApi.create(contactData);
      setContacts(prev => [...prev, newContact]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding contact');
      throw err;
    }
  }, []);

  const updateContact = useCallback(async (id: string, contactData: Partial<ContactPerson>) => {
    try {
      const updatedContact = await contactsApi.update(id, contactData);
      setContacts(prev =>
        prev.map(contact =>
          contact.id === id ? updatedContact : contact
        )
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating contact');
      throw err;
    }
  }, []);

  const deleteContact = useCallback(async (id: string) => {
    try {
      await contactsApi.delete(id);
      setContacts(prev => prev.filter(contact => contact.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting contact');
      throw err;
    }
  }, []);

  const addOpportunity = useCallback(async (opportunityData: Omit<Opportunity, 'id' | 'lastUpdated'>) => {
    try {
      const newOpportunity = await opportunitiesApi.create(opportunityData);
      setOpportunities(prev => [...prev, newOpportunity]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding opportunity');
      throw err;
    }
  }, []);

  const updateOpportunity = useCallback(async (id: string, opportunityData: Partial<Opportunity>) => {
    try {
      const updatedOpportunity = await opportunitiesApi.update(id, opportunityData);
      setOpportunities(prev =>
        prev.map(opportunity =>
          opportunity.id === id ? updatedOpportunity : opportunity
        )
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating opportunity');
      throw err;
    }
  }, []);

  const deleteOpportunity = useCallback(async (id: string) => {
    try {
      await opportunitiesApi.delete(id);
      setOpportunities(prev => prev.filter(opportunity => opportunity.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting opportunity');
      throw err;
    }
  }, []);

  const addInitiative = useCallback(async (initiativeData: Omit<Initiative, 'id' | 'lastUpdated'>) => {
    try {
      const newInitiative = await initiativesApi.create(initiativeData);
      setInitiatives(prev => [...prev, newInitiative]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding initiative');
      throw err;
    }
  }, []);

  const updateInitiative = useCallback(async (id: string, initiativeData: Partial<Initiative>) => {
    try {
      const updatedInitiative = await initiativesApi.update(id, initiativeData);
      setInitiatives(prev =>
        prev.map(initiative =>
          initiative.id === id ? updatedInitiative : initiative
        )
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating initiative');
      throw err;
    }
  }, []);

  const deleteInitiative = useCallback(async (id: string) => {
    try {
      await initiativesApi.delete(id);
      setInitiatives(prev => prev.filter(initiative => initiative.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting initiative');
      throw err;
    }
  }, []);

  const addContactToInitiative = useCallback(async (initiativeId: string, contactId: string) => {
    try {
      await initiativesApi.addContact(initiativeId, contactId);
      setInitiatives(prev =>
        prev.map(initiative =>
          initiative.id === initiativeId
            ? { ...initiative, contactIds: [...initiative.contactIds, contactId] }
            : initiative
        )
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding contact to initiative');
      throw err;
    }
  }, []);

  const removeContactFromInitiative = useCallback(async (initiativeId: string, contactId: string) => {
    try {
      await initiativesApi.removeContact(initiativeId, contactId);
      setInitiatives(prev =>
        prev.map(initiative =>
          initiative.id === initiativeId
            ? { ...initiative, contactIds: initiative.contactIds.filter(id => id !== contactId) }
            : initiative
        )
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while removing contact from initiative');
      throw err;
    }
  }, []);

  const addOpportunityToInitiative = useCallback(async (initiativeId: string, opportunityId: string) => {
    try {
      await initiativesApi.addOpportunity(initiativeId, opportunityId);
      setInitiatives(prev =>
        prev.map(initiative =>
          initiative.id === initiativeId
            ? { ...initiative, opportunityIds: [...initiative.opportunityIds, opportunityId] }
            : initiative
        )
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding opportunity to initiative');
      throw err;
    }
  }, []);

  const removeOpportunityFromInitiative = useCallback(async (initiativeId: string, opportunityId: string) => {
    try {
      await initiativesApi.removeOpportunity(initiativeId, opportunityId);
      setInitiatives(prev =>
        prev.map(initiative =>
          initiative.id === initiativeId
            ? { ...initiative, opportunityIds: initiative.opportunityIds.filter(id => id !== opportunityId) }
            : initiative
        )
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while removing opportunity from initiative');
      throw err;
    }
  }, []);

  const getInitiativesByAccount = useCallback(async (accountId: string) => {
    try {
      const accountInitiatives = await initiativesApi.getByAccount(accountId);
      setInitiatives(accountInitiatives);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching account initiatives');
      throw err;
    }
  }, []);

  const value = {
    contacts,
    opportunities,
    initiatives,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity,
    addInitiative,
    updateInitiative,
    deleteInitiative,
    addContactToInitiative,
    removeContactFromInitiative,
    addOpportunityToInitiative,
    removeOpportunityFromInitiative,
    getInitiativesByAccount,
  };

  return (
    <ContactOpportunityContext.Provider value={value}>
      {children}
    </ContactOpportunityContext.Provider>
  );
}; 