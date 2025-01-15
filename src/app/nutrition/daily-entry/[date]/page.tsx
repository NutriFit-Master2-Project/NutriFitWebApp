"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useRouter } from "next/router";

interface DailyEntry {
    date: string;
    calories: number;
    steps: number;
    meals: Meal[];
}

interface Meal {
    id: string;
    name: string;
    calories: number;
    quantity: number;
    image_url?: string;
}

export default function MealsPage({ params }: any) {
    const { date } = params; // Récupérer la date depuis les paramètres de l'URL

    // const {date}: string = new Date().toISOString().split("T")[0];
    // const apiBaseUrl: string = "https://nutrifitbackend-2v4o.onrender.com/api";
    const apiBaseUrl: string = "http://localhost:8000/api";
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

    const [dailyEntry, setDailyEntry] = useState<DailyEntry | null>(null);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    useEffect(() => {
        if (user && token) {
            console.log("🚀 ~ useEffect ~ user:", user);
            const fetchDailyEntry = async () => {
                try {
                    const entryRes = await fetch(`${apiBaseUrl}/daily_entries/${user?.userId}/entries/${date}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": token ?? "",
                        },
                    });
                    if (!entryRes.ok) {
                        throw new Error("Impossible de récupérer l'entrée quotidienne.");
                    }
                    const entryData: DailyEntry = await entryRes.json();
                    console.log("🚀 ~ fetchDailyEntry ~ entryData:", entryData);
                    setDailyEntry(entryData);
                    setMeals(entryData.meals);

                    // const mealsRes = await fetch(`${apiBaseUrl}/daily_entries/${user?.userId}/entries/${date}/meals`, {
                    //     method: "GET",
                    //     headers: {
                    //         "Content-Type": "application/json",
                    //         "auth-token": token ?? "",
                    //     },
                    // });
                    // if (mealsRes.ok) {
                    //     const mealsData: Meal[] = await mealsRes.json();
                    //     console.log("🚀 ~ fetchDailyEntry ~ mealsData:", mealsData);
                    //     setMeals(mealsData);
                    // }
                } catch (err: any) {
                    setError(err.message);
                }
            };

            fetchDailyEntry();
        }
    }, [user, token]);

    const handleDelete = async (mealId: string) => {
        try {
            const res = await fetch(`${apiBaseUrl}/daily_entries/${user?.userId}/entries/${date}/meals/${mealId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token ?? "",
                },
            });
            if (res.ok) {
                setMeals((prev) => prev.filter((meal) => meal.id !== mealId));
            } else {
                throw new Error("Erreur lors de la suppression du repas.");
            }
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500">Erreur: {error}</div>
            </div>
        );
    }

    if (!dailyEntry) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="mb-6">
                <CardHeader>
                    <h1 className="text-2xl font-semibold">Entrée quotidienne - {dailyEntry.date}</h1>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Badge variant="outline" className="mb-2">
                                Calories consommées
                            </Badge>
                            <p className="text-lg font-medium">{dailyEntry.calories} kcal</p>
                        </div>
                        <div>
                            <Badge variant="outline" className="mb-2">
                                Nombre de pas
                            </Badge>
                            <p className="text-lg font-medium">{dailyEntry.steps}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <h2 className="text-xl font-semibold mb-4">Repas de la journée</h2>
            <div className="space-y-4">
                {meals.length > 0 ? (
                    meals.map((meal) => (
                        <Card key={meal.id} className="shadow-md">
                            <CardHeader className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold">{meal.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        {meal.calories} kcal - Quantité: {meal.quantity}
                                    </p>
                                </div>
                                {meal.image_url && (
                                    <img src={meal.image_url} alt={meal.name} className="w-40 h-40 rounded-md" />
                                )}
                            </CardHeader>
                            <Separator />
                            <CardFooter>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(meal.id)}>
                                    Supprimer
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-500">Aucun repas enregistré pour cette journée.</p>
                )}
            </div>
        </div>
    );
}
