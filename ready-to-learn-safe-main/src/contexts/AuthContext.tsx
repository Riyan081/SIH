import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface User {
  _id: string;
  email: string;
  name: string;
  type: 'student' | 'institution';
  // Optional institution reference for students
  institutionId?: string;
  // Student fields (updated structure)
  rollNo?: number;
  subject?: string; // was branch
  class?: string; // was division
  admissionYear?: number; // was year
  phone?: string;
  parentPhone?: string;
  // Institution location field
  location?: {
    state: string;
    district: string;
    city: string;
    pincode: string;
    address: string;
  };
  learningProgress?: {
    completedModules: Array<{
      moduleId: string;
      completedAt: Date;
      score: number;
    }>;
    totalQuizzesTaken: number;
    averageQuizScore: number;
    badgesEarned: Array<{
      badgeId: string;
      earnedAt: Date;
    }>;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: Date;
    totalStudyTime: number;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, userType: 'student' | 'institution', institutionId?: string) => Promise<void>;
  register: (userData: any, userType: 'student' | 'institution') => Promise<void>;
  logout: () => void;
  updateProfile: (userData: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = localStorage.getItem('safeed_token');
        const savedUser = localStorage.getItem('safeed_user');

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          
          // Verify token is still valid
          await verifyToken(savedToken);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid data
        localStorage.removeItem('safeed_token');
        localStorage.removeItem('safeed_user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Verify token validity
  const verifyToken = async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      if (data.success) {
        setUser(data.data.user);
        return data.data.user;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Token verification error:', error);
      // Clear invalid token
      setToken(null);
      setUser(null);
      localStorage.removeItem('safeed_token');
      localStorage.removeItem('safeed_user');
      throw error;
    }
  };

  // Login function
  const login = async (email: string, password: string, userType: 'student' | 'institution', institutionId?: string) => {
    setIsLoading(true);
    try {
      const endpoint = userType === 'student' ? '/auth/student/login' : '/auth/institution/login';
      const requestBody = {
        email,
        password,
        ...(userType === 'student' && institutionId && { institutionId })
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.success) {
        const { user: userData, token: authToken } = data.data;
        
        setUser(userData);
        setToken(authToken);
        
        // Save to localStorage
        localStorage.setItem('safeed_token', authToken);
        localStorage.setItem('safeed_user', JSON.stringify(userData));
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: any, userType: 'student' | 'institution') => {
    setIsLoading(true);
    try {
      const endpoint = userType === 'student' ? '/auth/student/register' : '/auth/institution/register';

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.success) {
        const { user: newUser, token: authToken } = data.data;
        
        setUser(newUser);
        setToken(authToken);
        
        // Save to localStorage
        localStorage.setItem('safeed_token', authToken);
        localStorage.setItem('safeed_user', JSON.stringify(newUser));
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('safeed_token');
    localStorage.removeItem('safeed_user');
  };

  // Update profile function
  const updateProfile = async (profileData: any) => {
    if (!token) throw new Error('No authentication token');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      if (data.success) {
        const updatedUser = data.data.user;
        setUser(updatedUser);
        localStorage.setItem('safeed_user', JSON.stringify(updatedUser));
      } else {
        throw new Error(data.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!token) return;

    try {
      const userData = await verifyToken(token);
      localStorage.setItem('safeed_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Refresh user error:', error);
      // Token might be invalid, logout user
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateProfile,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
