"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Flame } from "lucide-react";

const apiBaseUrl = "https://nutrifitbackend-2v4o.onrender.com/api";

const ExercisesPage = ({ params }: any) => {
    const { trainingId } = params;
    const [exercises, setExercises] = useState([]);
    const [trainingName, setTrainingName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

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
                        setExercises(training.exercises);
                        setTrainingName(training.name);
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

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Exercices - {trainingName}</h1>
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
                            {exercise.image && (
                                <Image
                                    src="/training/Force Globale.jpg"
                                    // src={`/exercises/${exercise.image}.jpg`}
                                    alt={exercise.name}
                                    width={200}
                                    height={200}
                                    className="mt-2 w-full object-contain rounded-lg"
                                />
                            )}
                            <p className="text-xl font-bold pt-4">Muscles: {exercise.muscles.join(", ")}</p>
                            <p className="text-l text-gray-500 font-bold">
                                Séries: {exercise.series} - Répétitions: {exercise.repetitions}
                            </p>
                            <p className="text-sm text-gray-500">{exercise.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ExercisesPage;
