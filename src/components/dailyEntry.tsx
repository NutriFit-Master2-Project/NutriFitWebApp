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
    caloriesBurn: number;
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

    const apiBaseUrl: string = "https://nutri-fit-back-576739684905.europe-west1.run.app/api";

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
                console.log(
                    "🚀 ~ fetchDailyEntry ~ (dailyEntry!.steps * 100) / 3000:",
                    (dailyEntry?.steps ?? 1 * 100) / 3000
                );
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDailyEntry();
    }, [userId, date, apiBaseUrl, token]);

    if (loading) {
        return (
            <Card
                className="max-w-xs transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer"
                x-chunk="charts-01-chunk-5"
            >
                <Link href={`/nutrition/daily-entry/${date}`}>
                    <CardContent className="flex gap-4 p-4 cursor-pointer">
                        <div className="grid items-center gap-2">
                            <div className="grid flex-1 auto-rows-min gap-0.5">
                                <div className="text-sm text-muted-foreground">Calories Consommées</div>
                                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                                    0<span className="text-sm font-normal text-muted-foreground">kcal</span>
                                </div>
                            </div>
                            <div className="grid flex-1 auto-rows-min gap-0.5">
                                <div className="text-sm text-muted-foreground">Calories Brûlées</div>
                                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                                    0<span className="text-sm font-normal text-muted-foreground">kcal</span>
                                </div>
                            </div>
                            <div className="grid flex-1 auto-rows-min gap-0.5">
                                <div className="text-sm text-muted-foreground">Pas</div>
                                <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                                    0/3000
                                    <span className="text-sm font-normal text-muted-foreground">pas</span>
                                </div>
                            </div>
                        </div>
                        <ChartContainer
                            config={{
                                calories: {
                                    label: "Calories Consommées",
                                    color: "hsl(var(--chart-1))",
                                },
                                caloriesBurn: {
                                    label: "Calories Brûlées",
                                    color: "hsl(var(--chart-2))",
                                },
                                steps: {
                                    label: "Pas",
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
                                        activity: "steps",
                                        value: 0,
                                        fill: "var(--color-steps)",
                                    },
                                    {
                                        activity: "caloriesBurn",
                                        value: 0,
                                        fill: "var(--color-caloriesBurn)",
                                    },
                                    {
                                        activity: "calories",
                                        value: 0,
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
                            <div className="text-sm text-muted-foreground">Calories Consommées</div>
                            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                                {Number(dailyEntry.calories).toFixed(0)}
                                <span className="text-sm font-normal text-muted-foreground">kcal</span>
                            </div>
                        </div>
                        <div className="grid flex-1 auto-rows-min gap-0.5">
                            <div className="text-sm text-muted-foreground">Calories Brûlées</div>
                            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                                {Number(dailyEntry.caloriesBurn).toFixed(0)}
                                <span className="text-sm font-normal text-muted-foreground">kcal</span>
                            </div>
                        </div>
                        <div className="grid flex-1 auto-rows-min gap-0.5">
                            <div className="text-sm text-muted-foreground">Pas</div>
                            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                                {dailyEntry.steps}/3000
                                <span className="text-sm font-normal text-muted-foreground">pas</span>
                            </div>
                        </div>
                    </div>
                    <ChartContainer
                        config={{
                            calories: {
                                label: "Calories Consommées",
                                color: "hsl(var(--chart-1))",
                            },
                            caloriesBurn: {
                                label: "Calories Brûlées",
                                color: "hsl(var(--chart-2))",
                            },
                            steps: {
                                label: "Pas",
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
                                    activity: "steps",
                                    value: Math.min((dailyEntry.steps * 100) / 3000, 100),
                                    fill: "var(--color-steps)",
                                },
                                {
                                    activity: "caloriesBurn",
                                    value: Math.min((dailyEntry.caloriesBurn * 100) / 500, 100),
                                    fill: "var(--color-caloriesBurn)",
                                },
                                {
                                    activity: "calories",
                                    value: Math.min((dailyEntry.calories * 100) / (dailyCalories ?? 2000), 100),
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
