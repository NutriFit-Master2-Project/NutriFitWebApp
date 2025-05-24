"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Target, Zap, Trophy } from "lucide-react";
import Link from "next/link";

export default function InformationPage() {
    return (
        <div className="container flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl text-center">Bienvenue sur NutriFit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-center text-muted-foreground">
                        Votre assistant personnel pour une alimentation équilibrée et un suivi nutritionnel intelligent.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-blue-500" />
                            <span>Scannez vos aliments facilement</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <span>Suivez vos objectifs nutritionnels</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-500" />
                            <span>Analysez vos habitudes alimentaires</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-red-500" />
                            <span>Atteignez vos objectifs santé</span>
                        </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg mt-6">
                        <p className="text-sm text-center">
                            Commencez dès maintenant en scannant votre premier produit pour l'ajouter à votre frigo
                            virtuel !
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link href="/nutrition/food-scanner">
                        <Button size="lg" className="gap-2">
                            Commencer <span aria-hidden="true">→</span>
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
