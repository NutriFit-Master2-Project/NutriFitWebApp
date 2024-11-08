"use client";

import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FoodDetails } from "@/components/food-details"; // Composant réutilisable pour afficher les détails
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BarcodeScannerWithPopup from "@/components/barcode-scan";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Ghost } from "lucide-react";

const FoodScanner: React.FC = () => {
    const [barcode, setBarcode] = useState<string>("");
    const [scannedData, setScannedData] = useState<any>(null);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false); // État pour le chargement de l'ajout
    const { token, user } = useAuth();
    const { toast } = useToast();

    // Fonction pour récupérer les informations du produit
    const fetchProductData = async (code: string) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://nutrifitbackend-2v4o.onrender.com/api/nutrition/get-nutritional-info/${code}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "auth-token": token ?? "" },
                }
            );

            const data = await response.json();
            if (data && !data.error) {
                setIsEmpty(false);
                setScannedData(data); // Mettre à jour les données scannées
            } else {
                setIsEmpty(true);
            }
        } catch (error: any) {
            toast({
                title: "Erreur lors de la récupération des données du produit",
                description: error?.message ?? "Erreur",
                variant: "destructive",
            });
            console.error("Erreur lors de la récupération des données du produit:", error);
        } finally {
            setLoading(false);
        }
    };

    // Gérer l'entrée manuelle du code-barres
    const handleManualBarcodeSubmit = async () => {
        if (barcode) {
            await fetchProductData(barcode);
        }
    };

    // Gérer le succès du scan
    const handleScanSuccess = async (scannedCode: string) => {
        setBarcode(scannedCode);
        await fetchProductData(scannedCode);
    };

    const addProductToInventory = async () => {
        setAdding(true); // Début de l'ajout

        try {
            const response: Response = await fetch(
                `https://nutrifitbackend-2v4o.onrender.com/api/nutrition/save-product/${user?.userId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "auth-token": token ?? "" },
                    body: JSON.stringify(scannedData),
                }
            );

            await response.json();

            if (response.ok) {
                toast({
                    title: "Ajout du produit",
                    description: "Produit ajouté avec succès",
                    variant: "default",
                });
            } else {
                toast({
                    title: "Erreur",
                    description: "Erreur lors de l'ajout du produit",
                    variant: "destructive",
                });
            }
        } catch (error: any) {
            toast({
                title: "Erreur",
                description: error?.message ?? "Erreur lors de l'ajout du produit",
                variant: "destructive",
            });
        } finally {
            setAdding(false); // Fin de l'ajout
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white">
            <Card className="mb-6 bg-white">
                <CardHeader className="sticky top-0 z-10 bg-white">
                    <CardTitle className="mb-4 text-gray-900">Scanner un Aliment</CardTitle>

                    {/* Champ de saisie pour l'entrée manuelle */}
                    <div className="flex items-center justify-center space-x-4">
                        <Input
                            type="text"
                            placeholder="Entrez le code-barres"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            className="w-full"
                        />
                        <Button onClick={handleManualBarcodeSubmit} disabled={!barcode || loading}>
                            Rechercher
                        </Button>
                        {/* Intégration du scanner via caméra */}
                        <BarcodeScannerWithPopup onScanSuccess={handleScanSuccess} />
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Affichage des détails du produit scanné */}
                    {loading && <div>Chargement des détails...</div>}
                    {/* Aliment inconnue */}
                    {!loading && isEmpty && (
                        <Card className="w-full max-w-md mx-auto p-6 mt-8 flex flex-col justify-center items-center text-center bg-white rounded-md">
                            <Ghost className="w-12 h-12  mb-4" />
                            <p className="text-lg font-semibold">Aliment inconnue</p>
                        </Card>
                    )}
                    {scannedData && !loading && !isEmpty && (
                        <FoodDetails
                            addProductToInventory={addProductToInventory}
                            adding={adding}
                            productName={scannedData.product_name}
                            ingredients={scannedData.ingredients_text}
                            energy={scannedData.nutriments.energy}
                            energyKcal={scannedData.nutriments["energy-kcal"]}
                            fat={scannedData.nutriments.fat}
                            saturatedFat={scannedData.nutriments["saturated-fat"]}
                            sugars={scannedData.nutriments.sugars}
                            salt={scannedData.nutriments.salt}
                            proteins={scannedData.nutriments.proteins}
                            nutriscore={scannedData.nutriscore_grade}
                            brands={scannedData.brands}
                            categories={scannedData.categories}
                            labels={scannedData.labels}
                            allergens={scannedData.allergens}
                            imageUrl={scannedData.image_url}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FoodScanner;
