"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const SignIn = () => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signIn(email, password);
        } catch (error) {
            setError("Échec de la connexion. Veuillez vérifier vos identifiants.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh] relative">
            {/* Partie gauche (formulaire de login) */}
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Connexion</h1>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    <form onSubmit={handleLogin} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@exemple.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Mot de passe</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Connexion en cours..." : "Se connecter"}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Vous n'avez pas de compte ?{" "}
                        <Link href="/auth/sign-up" className="underline">
                            S'inscrire
                        </Link>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex items-center justify-center bg-[#222222] h-full relative">
                <div className="w-full h-full flex justify-center">
                    <Image
                        src="/mockups_list.png"
                        alt="NutriFit Icon"
                        width={768}
                        height={432}
                        className="object-cover w-full h-full"
                    />
                </div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <Image
                        src="/logo_transparent.png"
                        alt="NutriFit Icon"
                        width={250}
                        height={250}
                        className="object-contain"
                    />
                </div>
            </div>
        </div>
    );
};

export default SignIn;
