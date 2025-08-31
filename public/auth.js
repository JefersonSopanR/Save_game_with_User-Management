"use strict";
// Check authentication and set welcome message
async function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const res = await fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const welcomeElement = document.getElementById('welcomeUser');
                if (welcomeElement) {
                    welcomeElement.textContent =
                        `Welcome, ${data.user.displayName || data.user.username}!`;
                }
            }
        }
        catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = '/login.html';
        }
    }
}
function logoutUser() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}
//document.addEventListener('DOMContentLoaded', () => {
//   //friendRequestNotification();
//});
// Make functions available globally
window.checkAuth = checkAuth;
window.logout = logoutUser;
//# sourceMappingURL=auth.js.map