"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { fetchWithInterceptor } from "@/utils/fetchInterceptor";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Product {
    _id: string;
    product_name: string;
    nutriments: {
        "energy-kcal": number;
        fat: number;
        sugars: number;
        salt: number;
        proteins: number;
    };
    nutriscore_grade: string;
    brands: string;
    categories: string;
    image_url: string;
    ingredients_text: string;
    quantity: string;
    allergens: string[];
}

interface RecommendedDish {
    Name: string;
    Description: string;
    Food: string[];
    ExtraFood: string[];
    PreparationStep: string[];
    CookTime: string;
}

const RecommendDishPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [recommendedDish, setRecommendedDish] = useState<RecommendedDish | null>(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const { toast } = useToast();
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
            const fetchProducts = async () => {
                setError(null);
                try {
                    const response = await fetchWithInterceptor(
                        `https://nutrifitbackend-2v4o.onrender.com/api/nutrition/product-list/${user?.userId}`,
                        {
                            method: "GET",
                            headers: { "Content-Type": "application/json", "auth-token": token ?? "" },
                        }
                    );
                    if (!response.ok) {
                        throw new Error("Erreur lors de la récupération des produits");
                    }
                    const data = await response.json();
                    setProducts(data);
                } catch (error) {
                    setError("Une erreur est survenue lors de la récupération des produits.");
                    console.error(error);
                } finally {
                    setInitialLoading(false);
                }
            };

            fetchProducts();
        }
    }, [user, token]);

    const recommendDish = async () => {
        if (!products.length) {
            toast({ title: "Aucun produit disponible pour générer une recommandation." });
            return;
        }

        setLoading(true);
        try {
            const aliments = products.map((product) => product.product_name);
            const response = await fetch("https://nutrifitbackend-2v4o.onrender.com/api/recommend-dish", {
                method: "POST",
                headers: { "Content-Type": "application/json", "auth-token": token ?? "" },
                body: JSON.stringify({ aliments }),
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la recommandation de plat");
            }

            const data = await response.json();
            setRecommendedDish(data);
        } catch (error) {
            toast({ title: "Erreur lors de la recommandation de plat" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-center items-center mb-6">
                <h1 className="text-3xl font-bold pr-10">Plat Recommandé</h1>
                <Button
                    className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded-lg transition-all duration-300"
                    onClick={recommendDish}
                    disabled={initialLoading || loading}
                >
                    🍽️ Obtenir une recommandation de plat
                </Button>
            </div>

            {loading ? (
                <p className="text-center text-gray-500 text-lg font-semibold pt-30">⏳ Chargement...</p>
            ) : recommendedDish ? (
                <motion.div
                    className="max-w-4xl mx-auto bg-white p-6 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card className="overflow-hidden rounded-lg">
                        <CardContent className="p-6">
                            <CardTitle className="text-4xl font-bold">{recommendedDish.Name}</CardTitle>
                            <p className="text-gray-600 mt-2 text-lg pb-5">{recommendedDish.Description}</p>

                            {recommendedDish.ExtraFood && recommendedDish.ExtraFood.length > 0 ? (
                                <div className="mt-4 bg-amber-50 p-4 rounded-lg border border-amber-200">
                                    <h3 className="font-bold text-2xl pb-2">🛍️ À acheter</h3>
                                    <p className="text-amber-700 mb-2">
                                        Ces ingrédients ne sont pas dans votre frigot :
                                    </p>
                                    <ul className="list-disc pl-5 text-gray-700 text-lg">
                                        {recommendedDish.ExtraFood.map((item, index) => (
                                            <li key={index} className="text-amber-800">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h3 className="font-bold text-2xl pb-2">🎉 Tout est prêt</h3>
                                    <p className="text-green-700 mb-2">
                                        Vous avez tous les ingrédients nécessaires dans votre frigot.
                                    </p>
                                </div>
                            )}

                            <div className="mt-4">
                                <h3 className="font-bold text-2xl pb-2">🛒 Ingrédients</h3>
                                <ul className="list-disc pl-5 text-gray-700 text-lg">
                                    {recommendedDish.Food.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-4 pt-5">
                                <h3 className="font-bold text-2xl pb-2">📖 Instructions</h3>
                                <ul className="list-decimal pl-5 text-gray-700 text-lg">
                                    {recommendedDish.PreparationStep.map((step, index) => (
                                        <li key={index}>{step}</li>
                                    ))}
                                </ul>
                            </div>
                            <p className="mt-4 text-lg font-semibold text-primary text-right">
                                ⏳ Temps de préparation : {recommendedDish.CookTime}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                ""
            )}
        </div>
    );
};

export default RecommendDishPage;
