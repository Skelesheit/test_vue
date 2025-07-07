export const authService = {
    getToken() {
        return localStorage.getItem('accessToken');
    },
    setToken(token) {
        localStorage.setItem('accessToken', token);
    },
    clearToken() {
        localStorage.removeItem('accessToken');
    },
    isLoggedIn() {
        return !!localStorage.getItem('accessToken');
    }
};
