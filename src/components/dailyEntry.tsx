"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import Link from "next/link";
import { fetchWithInterceptor } from "@/utils/fetchInterceptor";

type DailyEntry = {
    steps: number;
    calories: number;
    date: string;
    meals: { id: string }[];
};

type DailyEntryProps = {
    userId: string;
    date: string;
    token: string;
    dailyCalories?: number;
};

export default function DailyEntryCard({ userId, date, token, dailyCalories }: DailyEntryProps) {
    const [dailyEntry, setDailyEntry] = useState<DailyEntry | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const apiBaseUrl: string = "https://nutrifitbackend-2v4o.onrender.com/api";

    useEffect(() => {
        const fetchDailyEntry = async () => {
            try {
                const res = await fetchWithInterceptor(`${apiBaseUrl}/daily_entries/${userId}/entries/${date}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    },
                });

                if (!res.ok) {
                    throw new Error("Erreur lors de la récupération de l'entrée quotidienne.");
                }

                const data: DailyEntry = await res.json();
                setDailyEntry(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDailyEntry();
    }, [userId, date, apiBaseUrl, token]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (error) {
        return <div>Erreur : {error}</div>;
    }

    if (!dailyEntry) {
        return <div>Aucune donnée disponible.</div>;
    }

    return (
        <Card
            className="max-w-xs transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer"
            x-chunk="charts-01-chunk-5"
        >
            <Link href={`/nutrition/daily-entry/${date}`}>
                <CardContent className="flex gap-4 p-4 cursor-pointer">
                    <div className="grid items-center gap-2">
                        <div className="grid flex-1 auto-rows-min gap-0.5">
                            <div className="text-sm text-muted-foreground">Calories</div>
                            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                                {Number(dailyEntry.calories).toFixed(0)}/{Number(dailyCalories)?.toFixed(0) ?? 2000}
                                <span className="text-sm font-normal text-muted-foreground">kcal</span>
                            </div>
                        </div>
                        <div className="grid flex-1 auto-rows-min gap-0.5">
                            <div className="text-sm text-muted-foreground">Steps</div>
                            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                                {dailyEntry.steps}/3000
                                <span className="text-sm font-normal text-muted-foreground">steps</span>
                            </div>
                        </div>
                        <div className="grid flex-1 auto-rows-min gap-0.5">
                            <div className="text-sm text-muted-foreground">Meals</div>
                            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                                {dailyEntry.meals.length}/5
                                <span className="text-sm font-normal text-muted-foreground">meals</span>
                            </div>
                        </div>
                    </div>
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
                        className="mx-auto aspect-square w-full max-w-[80%]"
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
                                    value: (dailyEntry.meals.length / 5) * 100,
                                    fill: "var(--color-meals)",
                                },
                                {
                                    activity: "steps",
                                    value: (dailyEntry.steps / 3000) * 100,
                                    fill: "var(--color-steps)",
                                },
                                {
                                    activity: "calories",
                                    value: (dailyEntry.calories / (dailyCalories ?? 2000)) * 100,
                                    fill: "var(--color-calories)",
                                },
                            ]}
                            innerRadius="20%"
                            barSize={24}
                            startAngle={90}
                            endAngle={450}
                        >
                            <PolarAngleAxis type="number" domain={[0, 100]} dataKey="value" tick={false} />
                            <RadialBar dataKey="value" background cornerRadius={5} />
                        </RadialBarChart>
                    </ChartContainer>
                </CardContent>
            </Link>
        </Card>
    );
}
