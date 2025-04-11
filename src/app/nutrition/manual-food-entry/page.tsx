"use client";

import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { fetchWithInterceptor } from "@/utils/fetchInterceptor";
import { useAuth } from "@/context/AuthContext";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { Loader2 } from "lucide-react";

interface CaloriesInfo {
    name: string;
    quantity: number;
    calories: number;
    createdAt: string;
}

export default function ManualFoodEntryPage() {
    const [foodName, setFoodName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { token, user } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Première requête pour obtenir les calories
            const caloriesResponse = await fetchWithInterceptor(
                "https://nutrifitbackend-2v4o.onrender.com/api/calories-food",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token ?? "",
                    },
                    body: JSON.stringify({
                        Food: foodName,
                        Quantity: Number(quantity),
                    }),
                }
            );

            if (!caloriesResponse.ok) {
                throw new Error("Erreur lors de la récupération des calories");
            }

            const caloriesInfo: CaloriesInfo = await caloriesResponse.json();

            // Deuxième requête pour ajouter le repas
            const currentDate = getFormattedDate();
            const mealResponse = await fetchWithInterceptor(
                `https://nutrifitbackend-2v4o.onrender.com/api/daily_entries/${user?.userId}/entries/${currentDate}/meals`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token ?? "",
                    },
                    body: JSON.stringify({
                        name: caloriesInfo.name,
                        calories: caloriesInfo.calories,
                        quantity: String(caloriesInfo.quantity),
                        image_url: "plateIA",
                    }),
                }
            );

            if (!mealResponse.ok) {
                throw new Error("Erreur lors de l'ajout du repas");
            }

            toast({
                title: "Succès",
                description: "L'aliment a été ajouté avec succès",
                variant: "default",
            });

            // Réinitialiser le formulaire
            setFoodName("");
            setQuantity("");
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: error.message || "Une erreur est survenue",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Ajouter un aliment manuellement</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="foodName" className="text-sm font-medium">
                                Nom de l'aliment
                            </label>
                            <Input
                                id="foodName"
                                type="text"
                                value={foodName}
                                onChange={(e) => setFoodName(e.target.value)}
                                placeholder="Ex: blanc de poulet fumé"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="quantity" className="text-sm font-medium">
                                Quantité (en grammes ou millilitres)
                            </label>
                            <Input
                                id="quantity"
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                placeholder="Ex: 100"
                                min="1"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Ajout en cours...
                                </>
                            ) : (
                                "Ajouter l'aliment"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
