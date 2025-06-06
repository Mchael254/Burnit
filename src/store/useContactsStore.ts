// src/store/useContactsStore.ts
import { create } from 'zustand';

export type Contact = {
  id: string;
  name: string;
  mpesa_phone_numbers: string[];
  creation_timestamp: string;
  update_timestamp: string;
};

type ContactState = {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  setContacts: (contacts: Contact[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useContactsStore = create<ContactState>((set) => ({
  contacts: [],
  loading: false,
  error: null,
  setContacts: (contacts) => set({ contacts }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
