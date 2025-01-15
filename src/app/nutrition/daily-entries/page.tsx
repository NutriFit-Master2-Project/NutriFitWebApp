"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";

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

export default function DailyEntriesPage() {
    const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

    const apiBaseUrl = "http://localhost:8000/api";

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
            const fetchDailyEntries = async () => {
                try {
                    const res = await fetch(`${apiBaseUrl}/daily_entries/${user?.userId}/entries`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": token ?? "",
                        },
                    });
                    if (!res.ok) {
                        throw new Error("Erreur lors de la récupération des daily entries.");
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
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500">Chargement...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500">Erreur : {error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Liste des Daily Entries</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {dailyEntries.map((entry, index) => (
                    <Link
                        key={index}
                        href={`/nutrition/daily-entry/${entry.date}`}
                        className="hover:scale-105 transition-transform"
                    >
                        <Card className="shadow-lg rounded-lg border border-gray-200 overflow-hidden cursor-pointer bg-white p-4">
                            <CardContent className="flex flex-col items-center">
                                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                                    {new Date(entry.date).toLocaleDateString()}
                                </h2>

                                <div className="w-full max-w-[150px] ">
                                    <ChartContainer
                                        config={{
                                            calories: {
                                                label: "Calories",
                                                color: "hsl(var(--chart-1))",
                                            },
                                            steps: {
                                                label: "Steps",
                                                color: "hsl(var(--chart-2))",
                                            },
                                            meals: {
                                                label: "Meals",
                                                color: "hsl(var(--chart-3))",
                                            },
                                        }}
                                    >
                                        <RadialBarChart
                                            margin={{
                                                left: -10,
                                                right: -10,
                                                top: -10,
                                                bottom: -10,
                                            }}
                                            data={[
                                                {
                                                    activity: "meals",
                                                    value: (entry.meals.length / 5) * 100, // Ex : objectif 5 repas
                                                    fill: "var(--color-meals)",
                                                },
                                                {
                                                    activity: "steps",
                                                    value: (entry.steps / 10000) * 100, // Ex : objectif 10,000 steps
                                                    fill: "var(--color-steps)",
                                                },
                                                {
                                                    activity: "calories",
                                                    value: (entry.calories / 2000) * 100, // Ex : objectif 2000 calories
                                                    fill: "var(--color-calories)",
                                                },
                                            ]}
                                            innerRadius="20%"
                                            barSize={16}
                                            startAngle={90}
                                            endAngle={450}
                                        >
                                            <PolarAngleAxis
                                                type="number"
                                                domain={[0, 100]}
                                                dataKey="value"
                                                tick={false}
                                            />
                                            <RadialBar dataKey="value" background cornerRadius={5} />
                                        </RadialBarChart>
                                    </ChartContainer>
                                </div>

                                <div className="mt-4 text-center space-y-2">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-3 h-3 bg-[hsl(var(--chart-1))] rounded"></div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium text-gray-800">Calories:</span>{" "}
                                            {entry.calories} kcal
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-3 h-3 bg-[hsl(var(--chart-2))] rounded"></div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium text-gray-800">Steps:</span> {entry.steps}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-3 h-3 bg-[hsl(var(--chart-3))] rounded"></div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium text-gray-800">Repas:</span>{" "}
                                            {entry.meals.length}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
