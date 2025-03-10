"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { jwtDecode } from "jwt-decode";
import { FastForward } from "lucide-react";
import { fetchWithInterceptor } from "@/utils/fetchInterceptor";

interface User {
    userId: string;
    userName: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    signUp: (name: string, email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [shouldGetDataFromSotage, setShouldGetDataFromSotage] = useState<boolean>(true);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (shouldGetDataFromSotage) {
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");
            if (storedUser && storedToken && storedUser != "undefined" && storedToken != "undefined") {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                setShouldGetDataFromSotage(false);
            }
        }
    }, []);

    const signUp = async (name: string, email: string, password: string) => {
        try {
            const response = await fetchWithInterceptor("https://nutrifitbackend-2v4o.onrender.com/api/auth/sign-up", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error("Inscription impossible" + errorResponse?.message);
            }

            // Redirect after sign-up
            router.push("/auth/sign-in");
        } catch (error: any) {
            toast({
                title: "Sign-up Error",
                description: error?.message ?? "Failed to sign up. Please try again.",
                variant: "destructive",
            });
            console.error("Error during sign-up:", error);
        }
    };

    const fetchUserInfo = async (userId: string, token: string) => {
        try {
            const response = await fetchWithInterceptor(
                `https://nutrifitbackend-2v4o.onrender.com/api/user-info/${userId}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "auth-token": token },
                }
            );

            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des informations utilisateur : ${response.status}`);
            }

            const userInfo = await response.json();
            return userInfo;
        } catch (error) {
            console.error("Erreur lors de la récupération des informations utilisateur :", error);
            return null;
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const response = await fetchWithInterceptor("https://nutrifitbackend-2v4o.onrender.com/api/auth/sign-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error("Connexion impossible" + errorResponse?.message);
            }

            const data = await response.json();
            setToken(data.token);

            const decodedToken: any = jwtDecode(data.token);
            const userId: string = decodedToken?.userId;

            const userInfo = await fetchUserInfo(userId, data.token);

            if (userInfo) {
                setUser({ ...userInfo, userId });

                localStorage.setItem("user", JSON.stringify({ ...userInfo, userId }));
                localStorage.setItem("token", data.token);

                // If it's user first connexion then go to page to set user details data
                userInfo.activites ? router.push("/dashboard") : router.push("/user-info");
            } else {
                throw new Error("Impossible de récupérer les informations utilisateur");
            }
        } catch (error: any) {
            toast({
                title: "Connexion impossible",
                description: error?.message ?? "Failed to sign in. Please try again.",
                variant: "destructive",
            });
            console.error("Error during sign-in:", error);
        }
    };

    const signOut = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/login");
    };

    return <AuthContext.Provider value={{ user, token, signUp, signIn, signOut }}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Error of useAuth, must be used within an AuthProvider");
    }
    return context;
};
