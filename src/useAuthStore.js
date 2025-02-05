import { getCookie } from './utils';
import { create } from 'zustand';

const useAuthStore = create((set) => ({
    isLoggedIn: !!getCookie('access_token'),
    setIsLoggedIn: (status) => set({ isLoggedIn: status }),
}));

export default useAuthStore;