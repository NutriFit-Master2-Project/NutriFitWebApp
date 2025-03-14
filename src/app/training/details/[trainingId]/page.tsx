"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchWithInterceptor } from "@/utils/fetchInterceptor";
import { useToast } from "@/hooks/use-toast";
import { getFormattedDate } from "@/utils/getFormattedDate";

const apiBaseUrl = "https://nutrifitbackend-2v4o.onrender.com/api";

const ExercisesPage = ({ params }: any) => {
    const { trainingId } = params;
    const [exercises, setExercises] = useState([]);
    const [trainingName, setTrainingName] = useState("");
    const [trainingTotalCalories, setTrainingTotalCalories] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (user && token && trainingId) {
            const fetchExercises = async () => {
                try {
                    const res = await fetch(`${apiBaseUrl}/trainings`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": token ?? "",
                        },
                    });

                    if (!res.ok) {
                        throw new Error("Erreur lors du chargement des exercices");
                    }

                    const trainings = await res.json();
                    const training = trainings.find((t: any) => t.id === trainingId);

                    if (training) {
                        setTrainingTotalCalories(training.totalCalories);
                        setExercises(training.exercises);
                        setTrainingName(training.name);
                        console.log("🚀 ~ fetchExercises ~ training.exercises:", training.exercises);
                    } else {
                        throw new Error("Entraînement non trouvé");
                    }

                    setLoading(false);
                } catch (error: any) {
                    setError(error.message);
                    setLoading(false);
                }
            };

            fetchExercises();
        }
    }, [user, token, trainingId]);

    if (loading) return <p className="text-center text-lg font-semibold">Chargement...</p>;
    if (error) return <p className="text-center text-red-500">Erreur: {error}</p>;

    const updateCaloriesBurn = async () => {
        try {
            const res = await fetchWithInterceptor(
                `${apiBaseUrl}/daily_entries/${user?.userId}/entries/${getFormattedDate()}/add-calories-burn`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token ?? "",
                    },
                    body: JSON.stringify({
                        caloriesBurnToAdd: trainingTotalCalories,
                    }),
                }
            );
            if (res.ok) {
                toast({
                    title: "Séance réalisé",
                    description: "Nombre de calories journalière modifié.",
                    variant: "default",
                });
            } else {
                toast({
                    title: "Un problème est survenue",
                    description: "Réessayer plus tard.",
                    variant: "default",
                });
            }
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Exercices - {trainingName}</h1>
                <Button onClick={() => updateCaloriesBurn()}>
                    {loading ? "en cours..." : "Validé cette séance pour aujourd'hui"}
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exercises.map((exercise: any, index: number) => (
                    <Card key={index} className="relative">
                        <div className="absolute top-7 right-2 bg-white text-black text-s font-bold px-2 py-1 rounded flex items-center">
                            <Flame className="h-6 w-6 mr-1" />
                            {exercise.calories} calories
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl">{exercise.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-between">
                                {exercise.image && (
                                    <Image
                                        src={`/exercisesImages/${exercise.image}.png`}
                                        alt={exercise.name}
                                        width={200}
                                        height={200}
                                        className="mt-2 w-full object-contain rounded-lg"
                                    />
                                )}
                                <div className="mt-4 w-full">
                                    <p className="text-xl font-bold pt-4">Muscles: {exercise.muscles.join(", ")}</p>
                                    <p className="text-l text-gray-500 font-bold">
                                        Séries: {exercise.series} - Répétitions: {exercise.repetitions}
                                    </p>
                                    <p className="text-sm text-gray-500">{exercise.description}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ExercisesPage;
