import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, XAxis } from "recharts";

type DailyEntry = {
    date: string;
    steps: number;
};

type WalkingDistanceProps = {
    data: DailyEntry[];
};

export default function WalkingDistance({ data }: WalkingDistanceProps) {
    const averageSteps = data.reduce((sum, entry) => sum + entry.steps, 0) / data.length;

    return (
        <Card className="max-w-xs" x-chunk="charts-01-chunk-3">
            <CardHeader className="p-4 pb-0">
                <CardTitle>Walking Distance</CardTitle>
                <CardDescription>Over the last 7 days, your average daily steps were:</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
                <div className="flex items-baseline gap-1 text-3xl font-bold tabular-nums leading-none">
                    {averageSteps.toFixed(0)}
                    <span className="text-sm font-normal text-muted-foreground">steps/day</span>
                </div>
                <ChartContainer
                    config={{
                        steps: {
                            label: "Steps",
                            color: "hsl(var(--chart-2))",
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
                            steps: entry.steps,
                        }))}
                    >
                        <Bar dataKey="steps" fill="var(--color-steps)" radius={2} fillOpacity={0.3} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} hide />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
