import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { CirclePlus, FastForward } from "lucide-react";
import { Tooltip } from "./ui/tooltip";

interface FoodDetailsProps {
    productName: string;
    ingredients: string;
    energy: number;
    energyKcal: number;
    fat: number;
    saturatedFat: number;
    sugars: number;
    salt: number;
    proteins: number;
    nutriscore: string;
    brands: string;
    categories: string;
    labels: string;
    allergens: string[];
    imageUrl: string;
    addProductToInventory: (productData: any) => void;
    adding: boolean;
}

export const FoodDetails: React.FC<FoodDetailsProps> = ({
    productName,
    ingredients,
    energy,
    energyKcal,
    fat,
    saturatedFat,
    sugars,
    salt,
    proteins,
    nutriscore,
    brands,
    categories,
    labels,
    allergens,
    imageUrl,
    addProductToInventory,
    adding,
}) => {
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

    return (
        <Card className="max-w-3xl mx-auto p-6 mt-8 shadow-lg relative bg-white">
            {/* Nutriscore en haut à droite */}
            <div className="absolute top-4 left-4">
                <Badge className={`text-xl px-4 py-2 ${getNutriScoreVariant(nutriscore)}`}>
                    {nutriscore?.toUpperCase()}
                </Badge>
            </div>

            {/* Boutton pour ajouter le produit à l'inventaire de l'utilisateur */}
            <div className="absolute top-4 right-4">
                {/* <Button className="font-bold flex gap-2" onClick={addProductToInventory}>
                    Ajouter <CirclePlus />
                </Button> */}
                <Button
                    onClick={addProductToInventory}
                    disabled={adding} // Désactiver le bouton pendant le chargement
                    className="mt-4 flex gap-2"
                >
                    {adding ? (
                        <>
                            Ajout en cours <FastForward className="animate-spin" />
                        </>
                    ) : (
                        <>
                            Ajouter <CirclePlus />
                        </>
                    )}
                </Button>
            </div>

            {/* Image du produit */}
            <CardHeader className="flex justify-center items-center">
                <img src={imageUrl} alt={productName} className="w-40 h-40 object-contain mb-4" />
            </CardHeader>

            {/* Détails du produit */}
            <CardContent>
                {/* Nom du produit */}
                <CardTitle className="text-3xl font-bold text-center mb-4 text-gray-900">{productName}</CardTitle>

                {/* Marque du produit */}
                <p className="text-lg text-gray-600 text-center mb-6">{brands}</p>

                {/* Catégories */}
                <div className="text-lg text-gray-800 mb-6">
                    <h3 className="font-semibold">Catégories:</h3>
                    <p className="text-base text-gray-600 mt-1">{categories}</p>
                </div>

                {/* Ingrédients */}
                <div className="text-lg text-gray-800 mb-6">
                    <h3 className="font-semibold">Ingrédients:</h3>
                    <p className="text-base text-gray-600 mt-1">{ingredients}</p>
                </div>

                {/* Allergènes */}
                {allergens.length > 0 && (
                    <div className="text-lg text-gray-800 mb-6">
                        <h3 className="font-semibold text-red-600">Allergènes:</h3>
                        <p className="text-base text-red-600 mt-1">
                            {allergens.map((allergen) => allergen.replace("en:", "")).join(", ")}
                        </p>
                    </div>
                )}

                {/* Nutriments sous forme de tableau */}
                <div className="text-lg text-gray-800 mb-6">
                    <h3 className="font-semibold">Valeurs nutritionnelles pour 100g:</h3>
                    <Table className="mt-2">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nutriment</TableHead>
                                <TableHead>Quantité</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>Énergie</TableCell>
                                <TableCell>
                                    {energy} kJ ({energyKcal} kcal)
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Lipides</TableCell>
                                <TableCell>{fat} g</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Dont acides gras saturés</TableCell>
                                <TableCell>{saturatedFat} g</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Sucres</TableCell>
                                <TableCell>{sugars} g</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Sel</TableCell>
                                <TableCell>{salt} g</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Protéines</TableCell>
                                <TableCell>{proteins} g</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Labels */}
                <div className="text-lg text-gray-800 mb-6">
                    <h3 className="font-semibold">Labels:</h3>
                    <p className="text-base text-gray-600 mt-1">{labels}</p>
                </div>
            </CardContent>
        </Card>
    );
};
