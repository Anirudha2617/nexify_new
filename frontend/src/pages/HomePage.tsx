import React, { useState, useEffect, createContext, useContext } from 'react';

// Define your Django backend API base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Create a Context for authentication state
const AuthContext = createContext(null);

// AuthProvider component to manage and provide authentication state
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh the access token using the refresh token
  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      console.log('Access token refreshed successfully.');
      return data.access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Clear all tokens if refresh fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsAuthenticated(false);
      setUser(null);
      return null;
    }
  };

  // Function to fetch user profile
  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.status === 401) { // Unauthorized, possibly expired access token
          console.warn('Access token expired or invalid, attempting to refresh...');
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
              const newAccessToken = await refreshAccessToken(refreshToken);
              if (newAccessToken) {
                  return await fetchUserProfile(newAccessToken); // Retry fetching profile with new token
              }
          }
          throw new Error('Unauthorized: No valid tokens or refresh failed');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await response.json();
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Clear tokens and set isAuthenticated to false if fetching profile fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };


  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (accessToken) {
        // Try to fetch user profile with existing access token
        const success = await fetchUserProfile(accessToken);
        if (success) {
          setLoading(false);
          return;
        }
      }

      if (refreshToken) {
        // If access token failed or didn't exist, try refreshing it
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          // If refresh successful, try fetching profile again with new token
          await fetchUserProfile(newAccessToken);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // After successful login, immediately fetch user profile
      await fetchUserProfile(data.access);
      console.log('Login successful!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setIsAuthenticated(false);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, password2: password }), // password2 is required by Django serializer
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Handle specific validation errors from Django
        let errorMessage = 'Registration failed. ';
        if (errorData.username) errorMessage += `Username: ${errorData.username.join(' ')}. `;
        if (errorData.email) errorMessage += `Email: ${errorData.email.join(' ')}. `;
        if (errorData.password) errorMessage += `Password: ${errorData.password.join(' ')}. `;
        if (errorData.non_field_errors) errorMessage += `${errorData.non_field_errors.join(' ')}. `;
        if (errorData.detail) errorMessage = errorData.detail; // General error detail
        throw new Error(errorMessage);
      }

      console.log('Registration successful!');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };


  const logout = async () => {
    setLoading(true);
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // It's good practice to send the access token for logout if the backend expects it
            // but the primary purpose of this logout is to blacklist the refresh token.
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      }
      console.log('Logout API call successful (or refresh token not found).');
    } catch (error) {
      console.error('Error during logout API call:', error);
    } finally {
      // Always clear client-side tokens regardless of backend API call success
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      console.log('Logged out successfully from client-side!');
    }
  };

  const authContextValue = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use auth context
const useAuth = () => {
  return useContext(AuthContext);
};

// Login Form Component
const LoginForm = ({ onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const success = await login(username, password);
    if (!success) {
      setErrorMessage('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl max-w-sm w-full mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username-login" className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
          <input
            type="text"
            id="username-login" // Unique ID
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="Username"
          />
        </div>
        <div>
          <label htmlFor="password-login" className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
          <input
            type="password"
            id="password-login" // Unique ID
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
        </div>
        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          disabled={loading}
          aria-label="Login"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToRegister}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium focus:outline-none"
          aria-label="Create new account"
        >
          Don't have an account? Create one!
        </button>
      </div>
    </div>
  );
};

// Registration Form Component
const RegistrationForm = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrorMessage('Please enter a valid email address.');
        return;
    }

    const success = await register(username, email, password);
    if (success) {
      setSuccessMessage('Account created successfully! You can now login.');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setErrorMessage('Registration failed. Please try again or check console for details.');
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl max-w-sm w-full mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create New Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username-register" className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
          <input
            type="text"
            id="username-register"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-label="Username for registration"
          />
        </div>
        <div>
          <label htmlFor="email-register" className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            id="email-register"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email for registration"
          />
        </div>
        <div>
          <label htmlFor="password-register" className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
          <input
            type="password"
            id="password-register"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password for registration"
          />
        </div>
        <div>
          <label htmlFor="confirm-password-register" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password-register"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            aria-label="Confirm password for registration"
          />
        </div>
        {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 text-sm text-center">{successMessage}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
          disabled={loading}
          aria-label="Register"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium focus:outline-none"
          aria-label="Already have an account? Login"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

// Dashboard Component (Protected content)
const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl max-w-lg w-full mx-auto text-gray-800">
      <h2 className="text-3xl font-bold mb-4 text-center text-indigo-700">Welcome to your Dashboard!</h2>
      {user ? (
        <div className="space-y-3 text-lg">
          <p>Hello, <span className="font-semibold text-indigo-600">{user.username}</span>!</p>
          <p>Your email: <span className="font-semibold">{user.email}</span></p>
          <p className="mt-4 text-gray-600">This is a protected area, only accessible when logged in.</p>
        </div>
      ) : (
        <p className="text-center text-red-500">User data not found.</p>
      )}
      <button
        onClick={logout}
        className="mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
        aria-label="Logout"
      >
        Logout
      </button>
    </div>
  );
};

// Main App Component
const App = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false); // State to toggle between login and register forms

  // Tailwind CSS CDN for styling
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.innerHTML = `
      body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
    `;
    document.head.appendChild(style);

    const script = document.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';
    script.onload = () => {
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
            },
          },
        },
      };
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
      document.head.removeChild(script);
    };
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-xl font-semibold text-gray-700">Loading authentication state...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        showRegister ? (
          <RegistrationForm onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
        )
      )}
    </div>
  );
};

// Wrap the App with AuthProvider to make auth context available
const RootApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default RootApp;
