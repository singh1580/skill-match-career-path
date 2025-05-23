
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { AuthContextType } from '@/types/auth';
import { getUserRole, handleSignUp, handleSignIn, handleSignOut, updateUserProfile } from '@/utils/auth';

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch user role safely
  const fetchUserRole = async (userId: string) => {
    try {
      const role = await getUserRole(userId);
      console.log("Fetched user role:", role);
      setUserRole(role);
      return role;
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Use setTimeout to prevent deadlocks in the auth state callback
          setTimeout(() => {
            fetchUserRole(currentSession.user.id);
          }, 0);
        } else {
          setUserRole(null);
          setLoading(false);
        }
      }
    );

    // Then initialize session
    const initSession = async () => {
      try {
        console.log("Initializing auth session");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserRole(currentSession.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing session:", error);
        setLoading(false);
      }
    };

    initSession();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const data = await handleSignUp(email, password, name, role);
      // The auth state listener will handle setting the user and role
      // Navigation will be handled by the protected routes once auth state updates
      console.log("Signup successful:", data);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await handleSignIn(email, password);
      console.log("Sign in successful:", data);
      // The auth state listener will handle setting the user and role
      // Navigation will be handled by effect in the LoginForm
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await handleSignOut();
      console.log("Sign out successful");
      setUser(null);
      setSession(null);
      setUserRole(null);
      navigate('/login');
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error(error.message);
      throw error;
    }
  };

  const updateProfile = async (data: { name?: string }) => {
    try {
      if (!user) throw new Error('No user logged in');
      await updateUserProfile(user.id, data);
      console.log("Profile updated successfully");
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast.error('Error updating profile: ' + error.message);
      throw error;
    }
  };

  const contextValue = {
    user,
    session,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  console.log("AuthContext current state:", { 
    hasUser: !!user, 
    role: userRole, 
    isLoading: loading 
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
