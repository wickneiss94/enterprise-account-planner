import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account, getAccounts, createAccount, updateAccount, deleteAccount } from '../models/Account';
import { useFirebase } from './FirebaseContext';

interface AccountContextType {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  refreshAccounts: () => Promise<void>;
  addAccount: (account: Omit<Account, 'id'>) => Promise<string>;
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>;
  removeAccount: (id: string) => Promise<void>;
}

const AccountContext = createContext<AccountContextType | null>(null);

export const useAccounts = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccounts must be used within an AccountProvider');
  }
  return context;
};

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useFirebase();

  const refreshAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAccounts = await getAccounts();
      setAccounts(fetchedAccounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const addAccount = async (account: Omit<Account, 'id'>) => {
    try {
      setError(null);
      const id = await createAccount(account);
      await refreshAccounts();
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateAccountData = async (id: string, updates: Partial<Account>) => {
    try {
      setError(null);
      await updateAccount(id, updates);
      await refreshAccounts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update account';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const removeAccount = async (id: string) => {
    try {
      setError(null);
      await deleteAccount(id);
      await refreshAccounts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete account';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    if (currentUser) {
      refreshAccounts();
    } else {
      setAccounts([]);
      setLoading(false);
    }
  }, [currentUser]);

  const value = {
    accounts,
    loading,
    error,
    refreshAccounts,
    addAccount,
    updateAccount: updateAccountData,
    removeAccount
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
}; 