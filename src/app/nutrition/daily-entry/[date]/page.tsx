"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { fetchWithInterceptor } from "@/utils/fetchInterceptor";
import { Trash2 } from "lucide-react";
import { updateDailyCalories } from "@/utils/updateDailyCalories";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { useToast } from "@/hooks/use-toast";
import CalendarDailyEntry from "@/components/calendar-daily-entry";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config/api";

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

    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const [dailyEntry, setDailyEntry] = useState<DailyEntry | null>(null);
    const [meals, setMeals] = useState<Meal[]>([]);
    const [error, setError] = useState<string | null>(null);

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
            const fetchDailyEntry = async () => {
                try {
                    const entryRes = await fetchWithInterceptor(
                        `${API_BASE_URL}/daily_entries/${user?.userId}/entries/${date}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "auth-token": token ?? "",
                            },
                        }
                    );
                    if (!entryRes.ok) {
                        throw new Error("Impossible de récupérer l'entrée quotidienne.");
                    }
                    const entryData: DailyEntry = await entryRes.json();
                    console.log("🚀 ~ fetchDailyEntry ~ entryData:", entryData);
                    setDailyEntry(entryData);
                    setMeals(entryData.meals);
                } catch (err: any) {
                    setError(err.message);
                }
            };

            fetchDailyEntry();
        }
    }, [user, token]);

    const handleDelete = async (mealId: string) => {
        try {
            const res = await fetchWithInterceptor(
                `${API_BASE_URL}/daily_entries/${user?.userId}/entries/${date}/meals/${mealId}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token ?? "",
                    },
                }
            );
            if (res.ok) {
                setMeals((prev) => prev.filter((meal) => meal.id !== mealId));
                handleUpdateDailyCalories();
            } else {
                throw new Error("Erreur lors de la suppression du repas.");
            }
        } catch (err: any) {
            alert(err.message);
        }
    };

    async function handleUpdateDailyCalories() {
        const updatedCalories = await updateDailyCalories(user.userId, token ?? "", getFormattedDate(), user.calories);
        if (updatedCalories) {
            setDailyEntry((prev) => {
                if (prev) {
                    return {
                        ...prev,
                        calories: updatedCalories,
                    };
                }
                return null;
            });
        }

        toast({
            title: "Suppression du produit",
            description: "Produit supprimé avec succès.",
            variant: "default",
        });
    }

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

            <div className="fixed top-4 right-4 z-10 bg-white">
                <CalendarDailyEntry defaultDate={date} />
            </div>

            <h2 className="text-xl font-semibold mb-4">Repas de la journée</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {meals.length > 0 ? (
                    meals.map((meal) => (
                        <Card key={meal.id} className="shadow-md relative">
                            <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => handleDelete(meal.id)}
                            >
                                <Trash2 className="w-6 h-6" />
                            </Button>
                            <CardHeader className="flex flex-col items-center">
                                <img
                                    src={
                                        meal.image_url &&
                                        meal.image_url.trim() !== "" &&
                                        meal.image_url.trim() !== "plateIA"
                                            ? meal.image_url
                                            : "/logo.png"
                                    }
                                    alt={meal.name}
                                    className="w-20 h-20 object-cover rounded-md mb-2"
                                />
                                <h3 className="text-base font-semibold text-center">{meal.name}</h3>
                                <p className="text-xs text-gray-500 text-center">
                                    {meal.calories} kcal - Quantité: {meal.quantity}
                                </p>
                            </CardHeader>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full text-center">
                        Aucun repas enregistré pour cette journée.
                    </p>
                )}
            </div>
        </div>
    );
}
