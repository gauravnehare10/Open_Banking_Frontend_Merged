import { getCookie } from './utils';
import { create } from 'zustand';

const useAuthStore = create((set) => {
    const token = getCookie('access_token');

    if (token) {
        const tokenData = JSON.parse(atob(token.split('.')[1])); 
        const expirationTime = tokenData.exp * 1000;
        const currentTime = new Date().getTime();
        
        setTimeout(() => {
            set({ isLoggedIn: false });
            window.location.reload();
        }, expirationTime - currentTime);
    }

    return {
        isLoggedIn: !!token,
        setIsLoggedIn: (status) => set({ isLoggedIn: status }),
    };
});

export default useAuthStore;