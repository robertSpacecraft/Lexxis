const TOKEN_KEY = 'lexxis_token';
const USER_KEY = 'lexxis_user';

export const authStorage = {
    getToken: () => localStorage.getItem(TOKEN_KEY),
    setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
    removeToken: () => localStorage.removeItem(TOKEN_KEY),

    getUser: () => {
        const user = localStorage.getItem(USER_KEY);
        try {
            return user ? JSON.parse(user) : null;
        } catch (e) {
            return null;
        }
    },
    setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
    removeUser: () => localStorage.removeItem(USER_KEY),

    clear: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
};
