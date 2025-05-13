"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, LabelList, PolarAngleAxis, RadialBar, RadialBarChart, XAxis, YAxis } from "recharts";
import Link from "next/link";
import { Separator } from "./ui/separator";
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

export default function TodayStat({ userId, date, token, dailyCalories }: DailyEntryProps) {
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
            <Card className="max-w-xs" x-chunk="charts-01-chunk-4">
                <CardContent className="flex gap-4 p-4 pb-2">
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
                            meals: {
                                label: "Repas",
                                color: "hsl(var(--chart-3))",
                            },
                        }}
                        className="h-[140px] w-full"
                    >
                        <BarChart
                            margin={{
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 10,
                            }}
                            data={[
                                {
                                    activity: "repas",
                                    value: 0,
                                    label: "0 repas",
                                    fill: "var(--color-meals)",
                                },
                                {
                                    activity: "pas",
                                    value: 0,
                                    label: "0 pas",
                                    fill: "var(--color-steps)",
                                },
                                {
                                    activity: "calories",
                                    value: 0,
                                    label: "0 kcal",
                                    fill: "var(--color-calories)",
                                },
                            ]}
                            layout="vertical"
                            barSize={32}
                            barGap={2}
                        >
                            <XAxis type="number" dataKey="value" hide />
                            <YAxis
                                dataKey="activity"
                                type="category"
                                tickLine={false}
                                tickMargin={4}
                                axisLine={false}
                                className="capitalize"
                            />
                            <Bar dataKey="value" radius={5}>
                                <LabelList
                                    position="insideLeft"
                                    dataKey="label"
                                    fill="white"
                                    offset={8}
                                    fontSize={12}
                                />
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex flex-row border-t p-4">
                    <div className="flex w-full items-center gap-2">
                        <div className="grid flex-1 auto-rows-min gap-0.5">
                            <div className="text-xs text-muted-foreground">Calories</div>
                            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                                0<span className="text-sm font-normal text-muted-foreground">kcal</span>
                            </div>
                        </div>
                        <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                        <div className="grid flex-1 auto-rows-min gap-0.5">
                            <div className="text-xs text-muted-foreground">Pas</div>
                            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                                0<span className="text-sm font-normal text-muted-foreground">pas</span>
                            </div>
                        </div>
                        <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                        <div className="grid flex-1 auto-rows-min gap-0.5">
                            <div className="text-xs text-muted-foreground">Repas</div>
                            <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                                0<span className="text-sm font-normal text-muted-foreground">repas</span>
                            </div>
                        </div>
                    </div>
                </CardFooter>
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
        <Card className="max-w-xs" x-chunk="charts-01-chunk-4">
            <CardContent className="flex gap-4 p-4 pb-2">
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
                        meals: {
                            label: "Repas",
                            color: "hsl(var(--chart-3))",
                        },
                    }}
                    className="h-[140px] w-full"
                >
                    <BarChart
                        margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 10,
                        }}
                        data={[
                            {
                                activity: "repas",
                                value: (dailyEntry.meals.length / 5) * 100,
                                label: `${dailyEntry.meals.length} repas`,
                                fill: "var(--color-meals)",
                            },
                            {
                                activity: "pas",
                                value: (dailyEntry.steps / 3000) * 100,
                                label: `${dailyEntry.steps} pas`,
                                fill: "var(--color-steps)",
                            },
                            {
                                activity: "calories",
                                value: (dailyEntry.calories / (dailyCalories ?? 2000)) * 100,
                                label: `${Number(dailyEntry.calories).toFixed(0)} kcal`,
                                fill: "var(--color-calories)",
                            },
                        ]}
                        layout="vertical"
                        barSize={32}
                        barGap={2}
                    >
                        <XAxis type="number" dataKey="value" hide />
                        <YAxis
                            dataKey="activity"
                            type="category"
                            tickLine={false}
                            tickMargin={4}
                            axisLine={false}
                            className="capitalize"
                        />
                        <Bar dataKey="value" radius={5}>
                            <LabelList position="insideLeft" dataKey="label" fill="white" offset={8} fontSize={12} />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-row border-t p-4">
                <div className="flex w-full items-center gap-2">
                    <div className="grid flex-1 auto-rows-min gap-0.5">
                        <div className="text-xs text-muted-foreground">Calories</div>
                        <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                            {Number(dailyEntry.calories).toFixed(0)}
                            <span className="text-sm font-normal text-muted-foreground">kcal</span>
                        </div>
                    </div>
                    <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                    <div className="grid flex-1 auto-rows-min gap-0.5">
                        <div className="text-xs text-muted-foreground">Pas</div>
                        <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                            {dailyEntry.steps}
                            <span className="text-sm font-normal text-muted-foreground">pas</span>
                        </div>
                    </div>
                    <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                    <div className="grid flex-1 auto-rows-min gap-0.5">
                        <div className="text-xs text-muted-foreground">Repas</div>
                        <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                            {dailyEntry.meals.length}
                            <span className="text-sm font-normal text-muted-foreground">repas</span>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
