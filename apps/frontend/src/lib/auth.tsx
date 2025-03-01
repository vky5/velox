"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./api";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  company?: string;
  role?: string;
}

interface User {
  id: string;
  email: string;
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
  isLoadingM: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingM, setIsLoadingM] = useState(true);
  const router = useRouter();

  const fetchUserProfile = async () => {
    try {
      const profile = await api.getProfile();
      setUser({
        id: profile.data._id || "temp-id",
        email: profile.data.email || "",
        profile: {
          firstName: profile.data.firstName || "",
          lastName: profile.data.lastName || "",
          phone: profile.data.phone || "",
          address: profile.data.address || "",
          company: profile.data.company || "",
          role: profile.data.role || "",
        },
      })  
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        await fetchUserProfile();
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setIsLoadingM(false);
      }
    };

    initAuth();
  }, []);


  // updating the user
  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  const signup = async (email: string, password: string) => {
    try {
      await api.signup(email, password);
      setUser({ id: "temp-id", email });
      router.push("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  
  const login = async (email: string, password: string) => {
    try {
      // login to get the cookie set
      await api.login(email, password);

      // Then get profile with the cookie
      const profileResponse = await api.getProfile();
      console.log("Profile response:", profileResponse.data);

      if (profileResponse.data) {
        setUser({
          id: profileResponse.data._id || "temp-id",
          email,
          profile: {
            firstName: profileResponse.data.firstName || "",
            lastName: profileResponse.data.lastName || "",
            phone: profileResponse.data.phone || "",
            address: profileResponse.data.address || "",
            company: profileResponse.data.company || "",
            role: profileResponse.data.role || "",
          },
        });

        console.log(user)
        router.push("/dashboard");
      } else {
        throw new Error("Failed to get user profile");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };


  // logging out the user 
  const logout = async () => {
    setUser(null);
    router.push("/");
  };

  const updateUserProfile = async (profileData: UserProfile) => {
    try {
      const updatedProfile = await api.updateProfile(profileData);
      setUser((prev) => (prev ? { ...prev, profile: updatedProfile } : null));
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        updateUserProfile,
        isLoadingM,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
