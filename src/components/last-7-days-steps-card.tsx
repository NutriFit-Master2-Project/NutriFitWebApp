"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { BarChart, Bar, XAxis, ReferenceLine, Label } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { fetchWithInterceptor } from "@/utils/fetchInterceptor";
import { useRouter } from "next/navigation";

type DailyEntry = {
    calories: number;
    steps: number;
    createdAt: {
        _seconds: number;
        _nanoseconds: number;
    };
    date: string;
    meals: Meal[];
};

type Meal = {
    id: string;
    name: string;
    calories: number;
    quantity: number;
    createdAt: {
        _seconds: number;
        _nanoseconds: number;
    };
};

export default function StepsCard() {
    const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const apiBaseUrl = "https://nutrifitbackend-2v4o.onrender.com/api";

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
            const fetchDailyEntries = async () => {
                try {
                    const res = await fetchWithInterceptor(`${apiBaseUrl}/daily_entries/${user?.userId}/entries`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": token ?? "",
                        },
                    });
                    if (!res.ok) {
                        throw new Error("Erreur lors de la récupération des données.");
                    }
                    const data: DailyEntry[] = await res.json();
                    setDailyEntries(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchDailyEntries();
        }
    }, [user, token]);

    if (loading) {
        return <div className="text-gray-500">Chargement...</div>;
    }

    if (error) {
        return <div className="text-red-500">Erreur : {error}</div>;
    }

    // Générer les 7 derniers jours consécutifs
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split("T")[0]); // Format YYYY-MM-DD
        }
        return days;
    };

    const last7Days = getLast7Days();

    // Mapper les données existantes sur les 7 derniers jours
    const stepsData = last7Days.map((date) => {
        const entry = dailyEntries.find((e) => e.date === date);
        return {
            date,
            steps: entry ? entry.steps : 0, // Utiliser 0 si le jour est manquant
        };
    });

    const totalSteps = stepsData.reduce((sum, entry) => sum + entry.steps, 0);
    const stepsGoal = 12000; // Exemple de valeur cible

    return (
        <Card className="lg:max-w-md">
            <CardHeader className="space-y-0 pb-2">
                <CardDescription>Aujourd'hui</CardDescription>
                <CardTitle className="text-4xl tabular-nums">
                    {stepsData[stepsData.length - 1]?.steps ?? 0}{" "}
                    <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">steps</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        steps: {
                            label: "Steps",
                            color: "hsl(var(--chart-1))",
                        },
                    }}
                >
                    <BarChart
                        accessibilityLayer
                        margin={{
                            left: -4,
                            right: -4,
                        }}
                        data={stepsData}
                    >
                        <Bar dataKey="steps" fill="var(--color-steps)" radius={5} fillOpacity={0.6} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={4}
                            tickFormatter={(value) => {
                                return new Date(value).toLocaleDateString("fr-FR", {
                                    weekday: "short",
                                });
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    hideIndicator
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        });
                                    }}
                                />
                            }
                            cursor={false}
                        />
                        <ReferenceLine
                            y={stepsGoal}
                            stroke="hsl(var(--muted-foreground))"
                            strokeDasharray="3 3"
                            strokeWidth={1}
                        >
                            <Label
                                position="insideBottomLeft"
                                value="Objectif de pas"
                                offset={10}
                                fill="hsl(var(--foreground))"
                            />
                            <Label
                                position="insideTopLeft"
                                value={`${stepsGoal}`}
                                className="text-lg"
                                fill="hsl(var(--foreground))"
                                offset={10}
                                startOffset={100}
                            />
                        </ReferenceLine>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1">
                <CardDescription>
                    Au cours des 7 derniers jours, vous avez marché{" "}
                    <span className="font-medium text-foreground">{totalSteps}</span> pas.
                </CardDescription>
                <CardDescription>
                    Vous devez encore marcher{" "}
                    <span className="font-medium text-foreground">
                        {stepsGoal - (stepsData[stepsData.length - 1]?.steps ?? 0)}
                    </span>{" "}
                    pas pour atteindre votre objectif d'aujourd'hui.
                </CardDescription>
            </CardFooter>
        </Card>
    );
}
