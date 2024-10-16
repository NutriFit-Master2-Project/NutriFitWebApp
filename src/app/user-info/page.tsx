"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserInfo {
    email?: string;
    age: number;
    weight: number;
    size: number;
    genre: boolean;
    activites: "SEDENTARY" | "ACTIVE" | "SPORTIVE";
    objective: "WEIGHTGAIN" | "WEIGHTLOSS";
}

export default function UserInfoForm() {
    const { user, token } = useAuth();
    const router = useRouter();

    const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({
        age: undefined,
        weight: undefined,
        size: undefined,
        genre: false,
        activites: "ACTIVE",
        objective: "WEIGHTGAIN",
    });
    const userInfoActivityMap = new Map([
        ["SEDENTARY", "Sédentaire"],
        ["ACTIVE", "Actif"],
        ["SPORTIVE", "Sportif"],
    ]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]:
                name === "age" || name === "weight" || name === "size" ? (value ? Number(value) : undefined) : value,
        });
    };

    const handleGenderUpdate = (value: string) => {
        setUserInfo({
            ...userInfo,
            genre: value === "homme" ? false : true,
        });
    };

    const handleActivitesChange = (value: "SEDENTARY" | "ACTIVE" | "SPORTIVE") => {
        setUserInfo({
            ...userInfo,
            activites: value,
        });
    };

    const handleObjectiveChange = (value: "WEIGHTGAIN" | "WEIGHTLOSS") => {
        setUserInfo({
            ...userInfo,
            objective: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch("https://nutrifitbackend-2v4o.onrender.com/api/user-info", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token ?? "",
                },
                body: JSON.stringify({ ...userInfo, id: user?.userId }),
            });

            if (!response.ok) {
                throw new Error(`Erreur: ${response.status}`);
            }

            await response.json();

            router.push("/dashboard");
        } catch (error) {
            console.error("Erreur lors de l'envoi des données:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md p-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Informations utilisateur</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label htmlFor="age">Quel âge avez-vous ?</Label>
                            <Input
                                type="number"
                                id="age"
                                name="age"
                                value={userInfo.age}
                                onChange={handleChange}
                                required
                                className="mt-1"
                            />
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="weight">Combien pesez-vous ? (kg)</Label>
                            <Input
                                type="number"
                                id="weight"
                                name="weight"
                                value={userInfo.weight}
                                onChange={handleChange}
                                required
                                className="mt-1"
                            />
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="size">Combien mesurez-vous ? (cm)</Label>
                            <Input
                                type="number"
                                id="size"
                                name="size"
                                value={userInfo.size}
                                onChange={handleChange}
                                required
                                className="mt-1"
                            />
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="genre">À quel genre appartenez-vous ?</Label>
                            <Select onValueChange={handleGenderUpdate}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={userInfo.genre ? "Femme" : "Homme"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="homme">Homme</SelectItem>
                                    <SelectItem value="femme">Femme</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="activites">Évaluez votre activité journalière</Label>
                            <Select onValueChange={handleActivitesChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            userInfo.activites ? userInfoActivityMap.get(userInfo.activites) : ""
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SEDENTARY">Sédentaire</SelectItem>
                                    <SelectItem value="ACTIVE">Actif</SelectItem>
                                    <SelectItem value="SPORTIVE">Sportif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="mb-4">
                            <Label htmlFor="objective">Quel est votre objectif avec NutriFit ?</Label>
                            <Select onValueChange={handleObjectiveChange}>
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            userInfo.objective === "WEIGHTGAIN" ? "Gain de masse" : "Perte de poids"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="WEIGHTLOSS">Perte de poids</SelectItem>
                                    <SelectItem value="WEIGHTGAIN">Gain de masse</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <CardFooter>
                            <Button type="submit" className="w-full">
                                Enregistrer
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
