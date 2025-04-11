import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

type DailyCaloriesEntry = {
    date: string;
    calories: number;
};

type WeeklyCaloriesProps = {
    data: DailyCaloriesEntry[];
};

export default function WeeklyCalories({ data }: WeeklyCaloriesProps) {
    const averageCalories = (data.reduce((sum, entry) => sum + entry.calories, 0) / data.length).toFixed(0);

    return (
        <Card className="flex flex-col lg:max-w-md" x-chunk="charts-01-chunk-1">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
                <div>
                    <CardDescription>Calories moyennes consommées</CardDescription>
                    <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
                        {averageCalories}
                        <span className="text-sm font-normal tracking-normal text-muted-foreground">kcal/jour</span>
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex flex-1 items-center">
                <ChartContainer
                    config={{
                        calories: {
                            label: "Calories",
                            color: "hsl(var(--chart-1))",
                        },
                    }}
                    className="w-full"
                >
                    <LineChart
                        accessibilityLayer
                        margin={{
                            left: 14,
                            right: 14,
                            top: 10,
                        }}
                        data={data}
                    >
                        <CartesianGrid
                            strokeDasharray="4 4"
                            vertical={false}
                            stroke="hsl(var(--muted-foreground))"
                            strokeOpacity={0.5}
                        />
                        <YAxis hide domain={["dataMin - 3000", "dataMax + 3000"]} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => {
                                return new Date(value).toLocaleDateString("en-US", {
                                    weekday: "short",
                                });
                            }}
                        />
                        <Line
                            dataKey="calories"
                            type="natural"
                            fill="var(--color-calories)"
                            stroke="var(--color-calories)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{
                                fill: "var(--color-calories)",
                                stroke: "var(--color-calories)",
                                r: 4,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
