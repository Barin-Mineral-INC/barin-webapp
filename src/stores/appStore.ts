import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

export interface Modal {
  id: string;
  type: 'confirm' | 'info' | 'custom';
  title: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface AppState {
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Modals
  modals: Modal[];
  addModal: (modal: Omit<Modal, 'id'>) => void;
  removeModal: (id: string) => void;
  clearModals: () => void;

  // Loading states
  loading: {
    global: boolean;
    staking: boolean;
    claiming: boolean;
    connecting: boolean;
  };
  setLoading: (key: keyof AppState['loading'], value: boolean) => void;

  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Notifications
      notifications: [],
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: Date.now(),
        };
        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto remove after duration
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration || 5000);
        }
      },
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
      clearNotifications: () => {
        set({ notifications: [] });
      },

      // Modals
      modals: [],
      addModal: (modal) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
          modals: [...state.modals, { ...modal, id }],
        }));
      },
      removeModal: (id) => {
        set((state) => ({
          modals: state.modals.filter((m) => m.id !== id),
        }));
      },
      clearModals: () => {
        set({ modals: [] });
      },

      // Loading states
      loading: {
        global: false,
        staking: false,
        claiming: false,
        connecting: false,
      },
      setLoading: (key, value) => {
        set((state) => ({
          loading: { ...state.loading, [key]: value },
        }));
      },

      // UI state
      sidebarOpen: false,
      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      // Error handling
      error: null,
      setError: (error) => {
        set({ error });
        if (error) {
          // Auto clear error after 10 seconds
          setTimeout(() => {
            get().clearError();
          }, 10000);
        }
      },
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'app-store',
    }
  )
);

// Selectors for better performance
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useModals = () => useAppStore((state) => state.modals);
export const useLoading = () => useAppStore((state) => state.loading);
export const useError = () => useAppStore((state) => state.error);

// Action selectors
export const useAddNotification = () => useAppStore((state) => state.addNotification);
export const useRemoveNotification = () => useAppStore((state) => state.removeNotification);
export const useAddModal = () => useAppStore((state) => state.addModal);
export const useRemoveModal = () => useAppStore((state) => state.removeModal);
export const useSetLoading = () => useAppStore((state) => state.setLoading);
export const useSetError = () => useAppStore((state) => state.setError);
export const useClearError = () => useAppStore((state) => state.clearError);
