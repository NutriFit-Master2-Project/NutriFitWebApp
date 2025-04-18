import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

type WeeklyStepsData = {
    week: string;
    steps: number;
};

type StepsComparisonProps = {
    data: WeeklyStepsData[];
};

export default function StepsComparison({ data }: StepsComparisonProps) {
    const currentWeekData = data.find((entry) => entry.week === "Cette semaine");
    const lastWeekData = data.find((entry) => entry.week === "La semaine dernière");

    const thisWeekAverage = currentWeekData ? currentWeekData.steps : 0;
    const lastWeekAverage = lastWeekData ? lastWeekData.steps : 0;

    return (
        <Card className="max-w-xs" x-chunk="charts-01-chunk-2">
            <CardHeader>
                <CardTitle>Progrès</CardTitle>
                <CardDescription>
                    {thisWeekAverage > lastWeekAverage
                        ? "Vous faites plus de pas par jour cette semaine que la semaine dernière. Continuez ainsi !"
                        : thisWeekAverage < lastWeekAverage
                        ? "Vous faites moins de pas par jour cette semaine que la semaine dernière. Continuez vos efforts !"
                        : "Vous maintenez le même nombre de pas par jour cette semaine que la semaine dernière. Belle constance !"}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid auto-rows-min gap-2">
                    <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                        {currentWeekData?.steps.toLocaleString() ?? "N/A"}
                        <span className="text-sm font-normal text-muted-foreground">pas/jour</span>
                    </div>
                    <ChartContainer
                        config={{
                            steps: {
                                label: "Pas",
                                color: "hsl(var(--chart-1))",
                            },
                        }}
                        className="aspect-auto h-[32px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            layout="vertical"
                            margin={{
                                left: 0,
                                top: 0,
                                right: 0,
                                bottom: 0,
                            }}
                            data={[currentWeekData]}
                        >
                            <Bar dataKey="steps" fill="var(--color-steps)" radius={4} barSize={32}>
                                <LabelList position="insideLeft" dataKey="week" offset={8} fontSize={12} fill="white" />
                            </Bar>
                            <YAxis dataKey="week" type="category" tickCount={1} hide />
                            <XAxis dataKey="steps" type="number" hide />
                        </BarChart>
                    </ChartContainer>
                </div>
                {/* Steps for last week */}
                <div className="grid auto-rows-min gap-2">
                    <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                        {lastWeekData?.steps.toLocaleString() ?? "N/A"}
                        <span className="text-sm font-normal text-muted-foreground">pas/jour</span>
                    </div>
                    <ChartContainer
                        config={{
                            steps: {
                                label: "Pas",
                                color: "hsl(var(--muted))",
                            },
                        }}
                        className="aspect-auto h-[32px] w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            layout="vertical"
                            margin={{
                                left: 0,
                                top: 0,
                                right: 0,
                                bottom: 0,
                            }}
                            data={[lastWeekData]}
                        >
                            <Bar dataKey="steps" fill="var(--color-steps)" radius={4} barSize={32}>
                                <LabelList
                                    position="insideLeft"
                                    dataKey="week"
                                    offset={8}
                                    fontSize={12}
                                    fill="hsl(var(--muted-foreground))"
                                />
                            </Bar>
                            <YAxis dataKey="week" type="category" tickCount={1} hide />
                            <XAxis dataKey="steps" type="number" hide />
                        </BarChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
}
