"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { fetchWithInterceptor } from "@/utils/fetchInterceptor";
import DailyEntryCard from "@/components/dailyEntry";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { useRouter } from "next/navigation";

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
    caloriesBurn: number;
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
    const router = useRouter();

    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

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
                        throw new Error("Erreur lors de la récupération des repas journalié.");
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
            {user.userId && token ? (
                <DailyEntryCard
                    userId={user.userId}
                    date={getFormattedDate()}
                    token={token}
                    dailyCalories={user.calories}
                />
            ) : (
                <p className="text-gray-500 text-center">Veuillez vous connecter pour accéder aux données</p>
            )}

            <h1 className="text-3xl font-bold text-gray-800 mb-8 pt-20">Journal Alimentaire</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {dailyEntries.map((entry, index) => (
                    <Link
                        key={index}
                        href={`/nutrition/daily-entry/${entry.date}`}
                        className="hover:scale-105 transition-transform"
                    >
                        <Card className="shadow-md rounded-md border border-gray-200 bg-white p-4 cursor-pointer">
                            <CardContent className="flex flex-col items-center">
                                {/* Graph */}
                                <div className="w-full max-w-[120px] mb-3">
                                    <ChartContainer
                                        config={{
                                            calories: {
                                                label: "Calories",
                                                color: "hsl(var(--chart-1))",
                                            },
                                            steps: {
                                                label: "Pas",
                                                color: "hsl(var(--chart-2))",
                                            },
                                            caloriesBurn: {
                                                label: "Calories Brûlées",
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
                                                    activity: "caloriesBurn",
                                                    value: Math.min((entry.caloriesBurn * 100) / 500, 100),
                                                    fill: "var(--color-meals)",
                                                },
                                                {
                                                    activity: "steps",
                                                    value: Math.min((entry.steps * 100) / 3000, 100),
                                                    fill: "var(--color-steps)",
                                                },
                                                {
                                                    activity: "calories",
                                                    value: Math.min(
                                                        (entry.calories * 100) / (user?.calories ?? 2000),
                                                        100
                                                    ),
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

                                {/* Metrics */}
                                <div className="mt-3 text-center space-y-1">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-[hsl(var(--chart-1))] rounded"></div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium text-gray-800">Calories :</span>{" "}
                                            {entry.calories} kcal
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-[hsl(var(--chart-2))] rounded"></div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium text-gray-800">Pas :</span> {entry.steps}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-[hsl(var(--chart-3))] rounded"></div>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium text-gray-800">Calories Brûlées :</span>{" "}
                                            {entry.caloriesBurn ?? 0} kcal
                                        </p>
                                    </div>
                                </div>

                                {/* Date */}
                                <p className="mt-4 text-xs text-gray-500">
                                    {new Date(entry.date).toLocaleDateString()}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
