"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, Weight, Ruler, Activity, Target, CircleUser, Zap, Trophy } from "lucide-react";
import { fetchWithInterceptor } from "@/utils/fetchInterceptor";

interface UserInfo {
    email?: string;
    age: number;
    weight: number;
    size: number;
    genre: boolean;
    activites: "SEDENTARY" | "ACTIVE" | "SPORTIVE";
    objective: "WEIGHTGAIN" | "WEIGHTLOSS";
}

export default function EditProfilePage() {
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
    const [loading, setLoading] = useState(true);

    const userInfoActivityMap = new Map([
        ["SEDENTARY", "Sédentaire"],
        ["ACTIVE", "Actif"],
        ["SPORTIVE", "Sportif"],
    ]);

    useEffect(() => {
        if (!user || !token) return;

        const fetchUserInfo = async () => {
            try {
                const response = await fetchWithInterceptor(
                    `https://nutri-fit-back-576739684905.europe-west1.run.app/api/user-info/${user.userId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json", "auth-token": token },
                    }
                );

                if (!response.ok) throw new Error("Erreur lors du chargement des données");

                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [user, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: name === "age" || name === "weight" || name === "size" ? Number(value) : value,
        });
    };

    const handleGenderUpdate = (value: string) => {
        setUserInfo({ ...userInfo, genre: value === "femme" });
    };

    const handleActivitesChange = (value: "SEDENTARY" | "ACTIVE" | "SPORTIVE") => {
        setUserInfo({ ...userInfo, activites: value });
    };

    const handleObjectiveChange = (value: "WEIGHTGAIN" | "WEIGHTLOSS") => {
        setUserInfo({ ...userInfo, objective: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetchWithInterceptor(
                "https://nutri-fit-back-576739684905.europe-west1.run.app/api/user-info",
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "auth-token": token ?? "" },
                    body: JSON.stringify({ ...userInfo, id: user?.userId }),
                }
            );

            if (!response.ok) {
                throw new Error(`Erreur: ${response.status}`);
            }

            router.push("/dashboard");
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500 text-lg font-semibold">⏳ Chargement des informations...</p>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md p-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Modifier mon profil</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="mb-4 flex items-center space-x-4">
                                <Calendar className="text-gray-500" />
                                <Label htmlFor="age">Âge</Label>
                            </div>
                            <Input
                                type="number"
                                id="age"
                                name="age"
                                value={userInfo.age || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-4 flex items-center space-x-2">
                                <Weight className="text-gray-500" />
                                <Label htmlFor="weight">Poids (kg)</Label>
                            </div>
                            <Input
                                type="number"
                                id="weight"
                                name="weight"
                                value={userInfo.weight || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-4 flex items-center space-x-2">
                                <Ruler className="text-gray-500" />
                                <Label htmlFor="size">Taille (cm)</Label>
                            </div>
                            <Input
                                type="number"
                                id="size"
                                name="size"
                                value={userInfo.size || ""}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-4 flex items-center space-x-2">
                                <CircleUser className="text-gray-500" />
                                <Label>Genre</Label>
                            </div>
                            <Select
                                onValueChange={handleGenderUpdate}
                                defaultValue={userInfo.genre ? "femme" : "homme"}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={userInfo.genre ? "Femme" : "Homme"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="homme">Homme</SelectItem>
                                    <SelectItem value="femme">Femme</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <div className="mb-4 flex items-center space-x-2">
                                <Zap className="text-gray-500" />
                                <Label>Activité</Label>
                            </div>
                            <Select onValueChange={handleActivitesChange} defaultValue={userInfo.activites}>
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={userInfoActivityMap.get(userInfo.activites ?? "SEDENTARY")}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SEDENTARY">Sédentaire</SelectItem>
                                    <SelectItem value="ACTIVE">Actif</SelectItem>
                                    <SelectItem value="SPORTIVE">Sportif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <div className="mb-4 flex items-center space-x-2">
                                <Trophy className="text-gray-500" />
                                <Label>Objectif</Label>
                            </div>
                            <Select onValueChange={handleObjectiveChange} defaultValue={userInfo.objective}>
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
                                Mettre à jour
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
