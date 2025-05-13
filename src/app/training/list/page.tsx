"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Dumbbell, Flame } from "lucide-react";

const apiBaseUrl = "https://nutri-fit-back-576739684905.europe-west1.run.app/api";

export interface Exercise {
    name: string;
    description: string;
    muscles: string[];
    series: number;
    repetitions: number;
    calories: number;
    image: string;
}

export interface Training {
    id: string;
    name: string;
    description: string;
    type: "WEIGHTLOSS" | "WEIGHTGAIN";
    exercises: Exercise[];
    totalCalories?: number;
}

const TrainingsPage = () => {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        } else {
            router.push("/auth/sign-in");
        }
    }, []);

    useEffect(() => {
        if (user && token) {
            const fetchTrainings = async () => {
                try {
                    const res = await fetch(`${apiBaseUrl}/trainings/type/${user.objective}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": token ?? "",
                        },
                    });
                    if (!res.ok) {
                        throw new Error("Erreur lors du chargement des entraînements");
                    }
                    const data = await res.json();
                    setTrainings(data);
                    setLoading(false);
                } catch (error: any) {
                    setError(error.message);
                    setLoading(false);
                }
            };
            fetchTrainings();
        }
    }, [user, token]);

    const handleCardClick = (trainingId: string) => {
        router.push(`/training/details/${trainingId}`);
    };

    if (loading) return <p className="text-center text-lg font-semibold">Chargement...</p>;
    if (error) return <p className="text-center text-red-500">Erreur: {error}</p>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-4xl font-bold mb-4 p-4 pb-8">Liste des entraînements</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainings.map((training) => (
                    <Card
                        key={training.id}
                        onClick={() => handleCardClick(training.id)}
                        className="relative cursor-pointer transform transition-transform hover:scale-105"
                    >
                        <Image
                            src={`/training/${training.name.replace(/\s+/g, "")}.jpg`}
                            alt={training.name}
                            width={400}
                            height={200}
                            className="w-full h-90 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2 bg-white text-black text-s font-bold px-2 py-1 rounded flex items-center">
                            <Flame className="h-6 w-6 mr-1" />
                            {training.totalCalories} calories
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">{training.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 mb-2">{training.description}</p>
                            {/* <div className="flex flex-col items-center text-sm text-gray-500">
                                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                                    <Dumbbell className="h-5 w-5" />
                                </div>
                            </div> */}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default TrainingsPage;
