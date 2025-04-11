import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis } from "recharts";

type DailyMealsEntry = {
    date: string;
    caloriesBurn: number;
};

type WeeklyMealsProps = {
    data: DailyMealsEntry[];
};

export default function WeeklyMeals({ data }: WeeklyMealsProps) {
    const totalCaloriesBurn = data.reduce((sum, entry) => sum + (entry.caloriesBurn ?? 0), 0);
    const averageCaloriesBurn = (totalCaloriesBurn / data.length).toFixed(1);

    return (
        <Card className="max-w-xs" x-chunk="charts-01-chunk-7">
            <CardHeader className="space-y-0 pb-0">
                <CardDescription>Calories Brûlées</CardDescription>
                <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                    {averageCaloriesBurn}
                    <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
                        kcal/jour
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ChartContainer
                    config={{
                        caloriesBurn: {
                            label: "CaloriesBurn",
                            color: "hsl(var(--chart-2))",
                        },
                    }}
                >
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                    >
                        <XAxis dataKey="date" hide />
                        <YAxis domain={["dataMin - 1", "dataMax + 1"]} hide />
                        <defs>
                            <linearGradient id="fillCaloriesBurn" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-caloriesBurn)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-caloriesBurn)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="caloriesBurn"
                            type="natural"
                            fill="url(#fillCaloriesBurn)"
                            fillOpacity={0.4}
                            stroke="var(--color-caloriesBurn)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
