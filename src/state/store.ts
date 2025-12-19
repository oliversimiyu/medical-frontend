// Global state management with Zustand
import { create } from 'zustand';
import type { Claim, AuditLogEntry, UploadHistory, InvestigationNote } from '../types';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  organizationCode: string;
  registeredAt: string;
}

interface AppState {
  // Authentication state
  isAuthenticated: boolean;
  currentUser: string | null;
  registeredUsers: User[];
  login: (email: string) => void;
  logout: () => void;
  register: (user: Omit<User, 'registeredAt'>) => boolean;

  // Claims state
  claims: Claim[];
  selectedClaim: Claim | null;
  setClaims: (claims: Claim[]) => void;
  selectClaim: (claim: Claim | null) => void;
  updateClaimStatus: (claimId: string, status: Claim['status']) => void;

  // Upload state
  uploadHistory: UploadHistory[];
  addUpload: (upload: UploadHistory) => void;

  // Investigation state
  investigationNotes: InvestigationNote[];
  addNote: (note: Omit<InvestigationNote, 'id' | 'timestamp'>) => void;

  // Audit log state
  auditLog: AuditLogEntry[];
  addAuditEntry: (entry: Omit<AuditLogEntry, 'id'>) => void;

  // Filter state
  filters: {
    riskLevel: string;
    status: string;
    searchTerm: string;
  };
  setFilters: (filters: Partial<AppState['filters']>) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth
  isAuthenticated: false,
  currentUser: null,
  registeredUsers: [],
  login: (email) => set({ isAuthenticated: true, currentUser: email }),
  logout: () => set({ isAuthenticated: false, currentUser: null }),
  register: (user) => {
    const state = get();
    const emailExists = state.registeredUsers.some(u => u.email === user.email);
    if (emailExists) {
      return false;
    }
    set({
      registeredUsers: [
        ...state.registeredUsers,
        { ...user, registeredAt: new Date().toISOString() }
      ]
    });
    return true;
  },

  // Claims
  claims: [],
  selectedClaim: null,
  setClaims: (claims) => set({ claims }),
  selectClaim: (claim) => set({ selectedClaim: claim }),
  updateClaimStatus: (claimId, status) =>
    set((state) => ({
      claims: state.claims.map((c) =>
        c.id === claimId ? { ...c, status } : c
      ),
    })),

  // Uploads
  uploadHistory: [],
  addUpload: (upload) =>
    set((state) => ({
      uploadHistory: [upload, ...state.uploadHistory],
    })),

  // Investigation
  investigationNotes: [],
  addNote: (note) =>
    set((state) => ({
      investigationNotes: [
        {
          ...note,
          id: `NOTE-${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
        ...state.investigationNotes,
      ],
    })),

  // Audit
  auditLog: [],
  addAuditEntry: (entry) =>
    set((state) => ({
      auditLog: [
        {
          ...entry,
          id: `AUD-${Date.now()}`,
        },
        ...state.auditLog,
      ],
    })),

  // Filters
  filters: {
    riskLevel: '',
    status: '',
    searchTerm: '',
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
}));
