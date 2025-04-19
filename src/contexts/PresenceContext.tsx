import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { useFirebase } from './FirebaseContext';
import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';

interface UserPresence {
  userId: string;
  email: string;
  lastSeen: Timestamp;
  status: 'online' | 'offline';
  currentPage?: string;
}

interface PresenceContextType {
  onlineUsers: UserPresence[];
  updateUserPresence: (page?: string) => Promise<void>;
}

const PresenceContext = createContext<PresenceContextType | null>(null);

export const usePresence = () => {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error('usePresence must be used within a PresenceProvider');
  }
  return context;
};

export const PresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const { currentUser } = useFirebase();

  useEffect(() => {
    if (!currentUser) return;

    // Subscribe to online users
    const presenceRef = collection(db, 'presence');
    const q = query(
      presenceRef,
      where('status', '==', 'online')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: UserPresence[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as UserPresence;
        // Only include users seen in the last 5 minutes
        const fiveMinutesAgo = new Date();
        fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
        
        if (data.lastSeen.toDate() > fiveMinutesAgo) {
          users.push(data);
        }
      });
      setOnlineUsers(users);
    });

    // Set up presence monitoring
    const userPresenceRef = doc(db, 'presence', currentUser.uid);
    
    // Update presence when user connects
    const updateOnlineStatus = async () => {
      await setDoc(userPresenceRef, {
        userId: currentUser.uid,
        email: currentUser.email,
        lastSeen: serverTimestamp(),
        status: 'online'
      });
    };

    // Update presence when user disconnects
    const updateOfflineStatus = async () => {
      await setDoc(userPresenceRef, {
        userId: currentUser.uid,
        email: currentUser.email,
        lastSeen: serverTimestamp(),
        status: 'offline'
      });
    };

    // Set up presence listeners
    window.addEventListener('beforeunload', updateOfflineStatus);
    window.addEventListener('focus', updateOnlineStatus);
    window.addEventListener('blur', updateOnlineStatus);

    // Initial presence update
    updateOnlineStatus();

    return () => {
      unsubscribe();
      window.removeEventListener('beforeunload', updateOfflineStatus);
      window.removeEventListener('focus', updateOnlineStatus);
      window.removeEventListener('blur', updateOnlineStatus);
      updateOfflineStatus();
    };
  }, [currentUser]);

  const updateUserPresence = async (page?: string) => {
    if (!currentUser) return;

    const userPresenceRef = doc(db, 'presence', currentUser.uid);
    await setDoc(userPresenceRef, {
      userId: currentUser.uid,
      email: currentUser.email,
      lastSeen: serverTimestamp(),
      status: 'online',
      currentPage: page
    });
  };

  return (
    <PresenceContext.Provider value={{ onlineUsers, updateUserPresence }}>
      {children}
    </PresenceContext.Provider>
  );
}; 