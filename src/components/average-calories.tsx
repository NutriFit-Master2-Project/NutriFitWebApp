import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, XAxis } from "recharts";

type DailyEntry = {
    date: string;
    calories: number;
};

type ActiveEnergyProps = {
    data: DailyEntry[];
};

export default function ActiveCalories({ data }: ActiveEnergyProps) {
    const averageCalories = data.reduce((sum, entry) => sum + entry.calories, 0) / data.length;

    return (
        <Card className="max-w-xs" x-chunk="charts-01-chunk-3">
            <CardHeader className="p-4 pb-0">
                <CardTitle>Énergie Active</CardTitle>
                <CardDescription>
                    Vous consommez en moyenne {averageCalories.toFixed(0)} calories par jour.
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-3">
                <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                    {averageCalories.toFixed(0)}
                    <span className="text-sm font-normal text-muted-foreground">kcal/jour</span>
                </div>
                <ChartContainer
                    config={{
                        calories: {
                            label: "Calories",
                            color: "hsl(var(--chart-1))",
                        },
                    }}
                    className="ml-auto w-[72px]"
                >
                    <BarChart
                        accessibilityLayer
                        margin={{
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                        }}
                        data={data.map((entry) => ({
                            date: entry.date,
                            calories: entry.calories,
                        }))}
                    >
                        <Bar dataKey="calories" fill="var(--color-calories)" radius={2} fillOpacity={0.3} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} hide />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
