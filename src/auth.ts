// Type definitions for authentication
interface User {
    username: string;
    displayName?: string;
}

interface AuthResponse {
    user: User;
}

interface LoginResponse {
    token?: string;
    error?: string;
}

// Check authentication and set welcome message
async function checkAuth(): Promise<void> {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const res = await fetch('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data: AuthResponse = await res.json();
                const welcomeElement = document.getElementById('welcomeUser');
                if (welcomeElement) {
                    welcomeElement.textContent = 
                        `Welcome, ${data.user.displayName || data.user.username}!`;
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            window.location.href = '/login.html';
        }
    }
}

function logoutUser(): void {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

//document.addEventListener('DOMContentLoaded', () => {
//   //friendRequestNotification();
//});

// Make functions available globally
(window as any).checkAuth = checkAuth;
(window as any).logout = logoutUser;
