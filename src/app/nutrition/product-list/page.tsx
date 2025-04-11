"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CirclePlus, FastForward, Trash2 } from "lucide-react";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { fetchWithInterceptor } from "@/utils/fetchInterceptor";
import { updateDailyCalories } from "@/utils/updateDailyCalories";
import { useToast } from "@/hooks/use-toast";
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

const ProductListPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmDeleteProduct, setConfirmDeleteProduct] = useState<Product | null>(null);
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [quantity, setQuantity] = useState("");
    const [confirmAddToTodayMeal, setConfirmAddToTodayMeal] = useState<Product | null>(null);
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
                setLoading(true);
                setError(null);
                try {
                    const response = await fetchWithInterceptor(
                        `https://nutrifitbackend-2v4o.onrender.com/api/nutrition/product-list/${user?.userId}`,
                        {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "auth-token": token ?? "",
                            },
                        }
                    );
                    if (!response.ok) {
                        throw new Error("Erreur lors de la récupération des produits");
                    }
                    const data: Product[] = await response.json();
                    setProducts(data);
                } catch (error) {
                    setError("Une erreur est survenue lors de la récupération des produits.");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };

            fetchProducts();
        }
    }, [user, token]);

    const getNutriScoreVariant = (nutriscore: string) => {
        switch (nutriscore?.toUpperCase()) {
            case "A":
                return "bg-green-500 text-white";
            case "B":
                return "bg-green-300 text-black";
            case "C":
                return "bg-yellow-300 text-black";
            case "D":
                return "bg-orange-400 text-black";
            case "E":
                return "bg-red-500 text-white";
            default:
                return "bg-gray-400 text-black";
        }
    };

    const deleteProduct = async (product: Product) => {
        try {
            const response = await fetchWithInterceptor(
                `https://nutrifitbackend-2v4o.onrender.com/api/nutrition/product/${user.userId}/${product._id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token ?? "",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Erreur lors de la suppression du produit");
            }

            setProducts((prevProducts) => prevProducts.filter((p) => p._id !== product._id));

            toast({
                title: "Suppression du produit",
                description: "Produit supprimé avec succès.",
                variant: "default",
            });
        } catch (err) {
            setError("Erreur lors de la suppression du produit.");
            console.error(err);
            toast({
                title: "Erreur",
                description: "Erreur lors de la suppression du produit.",
                variant: "destructive",
            });
        } finally {
            setConfirmDeleteProduct(null);
        }
    };

    const apiBaseUrl: string = "https://nutrifitbackend-2v4o.onrender.com/api";
    // const apiBaseUrl: string = "http://localhost:8000/api";

    const handleAddToTodayMeal = async (product: any, quantity: string) => {
        try {
            setAdding(true);
            const response = await fetchWithInterceptor(
                `${apiBaseUrl}/daily_entries/${user?.userId}/entries/${getFormattedDate()}/meals`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "auth-token": token ?? "" },
                    body: JSON.stringify({
                        name: product.product_name,
                        calories: Number(
                            ((Number(product.nutriments["energy-kcal"]) / 100) * Number(quantity)).toFixed(0)
                        ),
                        quantity: quantity,
                        image_url: product.image_url,
                    }),
                }
            );
            if (response.ok) {
                console.log("Produit ajouté avec succès !");
                toast({
                    title: "Produit ajouté",
                    description: "Produit ajouté avec succès.",
                    variant: "default",
                });
                handleUpdateDailyCalories();
            } else {
                console.error("Erreur lors de l'ajout du produit.");
                toast({
                    title: "Erreur",
                    description: "Erreur lors de l'ajout du produit.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Erreur réseau :", error);
            toast({
                title: "Erreur réseau",
                description: "Une erreur est survenu. Veuillez réessayer.",
                variant: "destructive",
            });
        } finally {
            setAdding(false);
        }
    };

    async function handleUpdateDailyCalories() {
        await updateDailyCalories(user.userId, token ?? "", getFormattedDate(), user.calories);
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Liste des Produits</h1>

            {loading && (
                <div className="flex justify-center items-center space-x-2">
                    <Progress value={50} className="w-[60%]" />
                    <p className="text-center text-lg text-gray-500">Chargement des produits...</p>
                </div>
            )}

            {error && (
                <div className="flex justify-center items-center space-x-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
                    </svg>
                    <p className="text-center text-lg text-red-500 font-semibold">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {products.map((product, index) => (
                    <Card
                        key={index}
                        className="relative hover:shadow-lg cursor-pointer"
                        onClick={() => setSelectedProduct(product)}
                    >
                        <div className="absolute top-4 right-4">
                            <Button
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDeleteProduct(product);
                                }}
                                className="p-1 text-red-500"
                            >
                                <Trash2 className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="absolute top-4 left-4">
                            <Badge className={`text-xl px-4 py-2 ${getNutriScoreVariant(product.nutriscore_grade)}`}>
                                {product.nutriscore_grade.toUpperCase()}
                            </Badge>
                        </div>

                        <CardContent className="flex flex-col items-center space-y-4">
                            <img
                                src={product.image_url}
                                alt={product.product_name}
                                className="w-48 h-48 object-contain rounded"
                            />

                            <div className="text-center space-y-2">
                                <CardTitle className="text-xl font-semibold">{product.product_name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{product.brands}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {selectedProduct && (
                <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
                    <DialogContent className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg space-y-4">
                        <div className="absolute top-1 left-1">
                            <Button
                                onClick={() => setConfirmAddToTodayMeal(selectedProduct)}
                                disabled={adding}
                                className="flex gap-2"
                            >
                                {adding ? (
                                    <>
                                        Ajout en cours <FastForward className="animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Ajouter à mes repas d'aujourd'hui <CirclePlus />
                                    </>
                                )}
                            </Button>
                        </div>

                        <DialogHeader className="flex justify-between items-center">
                            <DialogTitle className="text-2xl font-semibold text-gray-800">
                                {selectedProduct.product_name}
                            </DialogTitle>
                            <Badge
                                className={`px-4 py-2 text-lg ${getNutriScoreVariant(
                                    selectedProduct.nutriscore_grade
                                )}`}
                            >
                                {selectedProduct.nutriscore_grade.toUpperCase()}
                            </Badge>
                        </DialogHeader>

                        <div className="flex justify-center">
                            <img
                                src={selectedProduct.image_url}
                                alt={selectedProduct.product_name}
                                className="w-48 h-48 object-contain rounded"
                            />
                        </div>

                        <DialogDescription className="space-y-4 text-lg text-gray-700">
                            <div>
                                <strong>Quantité:</strong> {selectedProduct.quantity}
                            </div>
                            <div>
                                <strong>Ingrédients:</strong> {selectedProduct.ingredients_text}
                            </div>
                            <div>
                                <strong>Allergènes:</strong>{" "}
                                {selectedProduct.allergens && selectedProduct.allergens.length > 0
                                    ? selectedProduct.allergens.join(", ")
                                    : "Aucun"}
                            </div>

                            <div>
                                <strong>Valeurs nutritionnelles pour 100g:</strong>
                                <ul className="ml-4 list-disc space-y-1">
                                    <li>Énergie: {selectedProduct.nutriments["energy-kcal"]} kcal</li>
                                    <li>Matières grasses: {selectedProduct.nutriments.fat} g</li>
                                    <li>Sucres: {selectedProduct.nutriments.sugars} g</li>
                                    <li>Sel: {selectedProduct.nutriments.salt} g</li>
                                    <li>Protéines: {selectedProduct.nutriments.proteins} g</li>
                                </ul>
                            </div>
                        </DialogDescription>

                        <DialogFooter className="flex justify-end space-x-2">
                            <DialogClose asChild>
                                <Button variant="secondary" className="px-6 py-2">
                                    Fermer
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {confirmDeleteProduct && (
                <Dialog open={!!confirmDeleteProduct} onOpenChange={() => setConfirmDeleteProduct(null)}>
                    <DialogContent className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">Confirmer la suppression</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer le produit "{confirmDeleteProduct.product_name}" ?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex justify-end space-x-2">
                            <Button variant="secondary" onClick={() => setConfirmDeleteProduct(null)}>
                                Annuler
                            </Button>
                            <Button variant="destructive" onClick={() => deleteProduct(confirmDeleteProduct)}>
                                Supprimer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {confirmAddToTodayMeal && (
                <Dialog open={!!confirmAddToTodayMeal} onOpenChange={() => setConfirmAddToTodayMeal(null)}>
                    <DialogContent className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">Ajouter le produit</DialogTitle>
                            <DialogDescription>
                                Saisissez la quantité pour ajouter "{confirmAddToTodayMeal.product_name}" à votre repas
                                d'aujourd'hui.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                                Quantité (en grammes)
                            </label>
                            <input
                                id="quantity"
                                type="number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                        <DialogFooter className="flex justify-end space-x-2">
                            <Button variant="secondary" onClick={() => setConfirmAddToTodayMeal(null)}>
                                Annuler
                            </Button>
                            <Button
                                onClick={() => {
                                    handleAddToTodayMeal(confirmAddToTodayMeal, quantity);
                                    setConfirmAddToTodayMeal(null);
                                }}
                                disabled={adding || !quantity}
                            >
                                {adding ? "Ajout en cours..." : "Ajouter"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default ProductListPage;
