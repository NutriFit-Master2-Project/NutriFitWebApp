"use client";

import ActiveCalories from "@/components/average-calories";
import DailyEntryCard from "@/components/dailyEntry";
import Last7DaysStepsCard from "@/components/last-7-days-steps-card";
import StepsComparison from "@/components/steps-comparison";
import TodayStat from "@/components/todayStat";
import WalkingDistance from "@/components/walking-distance";
import WeeklyCalories from "@/components/weekly-calories";
import WeeklyMeals from "@/components/weekly-meals";
import { API_BASE_URL } from "@/config/api";
import { getFormattedDate } from "@/utils/getFormattedDate";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);
    const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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
                    const res = await fetch(`${API_BASE_URL}/daily_entries/${user?.userId}/entries`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "auth-token": token ?? "",
                        },
                    });
                    if (!res.ok) {
                        throw new Error("Erreur lors de la récupération des données.");
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

    const averageCalories = dailyEntries.reduce((sum, entry) => sum + entry.calories, 0) / dailyEntries.length;
    const averageCaloriesBurn = dailyEntries.reduce((sum, entry) => sum + entry.caloriesBurn, 0) / dailyEntries.length;
    const averageSteps = dailyEntries.reduce((sum, entry) => sum + entry.steps, 0) / dailyEntries.length;
    const averageMeals = dailyEntries.reduce((sum, entry) => sum + entry.meals.length, 0) / dailyEntries.length;

    // Générer les 7 derniers jours consécutifs
    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split("T")[0]); // Format YYYY-MM-DD
        }
        return days;
    };

    const last7Days = getLast7Days();

    // Mapper les données existantes sur les 7 derniers jours
    const stepsData = last7Days.map((date) => {
        const entry = dailyEntries.find((e) => e.date === date);
        return {
            date,
            steps: entry ? entry.steps : 0, // Utiliser 0 si le jour est manquant
        };
    });
    const caloriesData = last7Days.map((date) => {
        const entry = dailyEntries.find((e) => e.date === date);
        return {
            date,
            calories: entry ? entry.calories : 0, // Utiliser 0 si le jour est manquant
        };
    });
    const caloriesBurnData = last7Days.map((date) => {
        const entry = dailyEntries.find((e) => e.date === date);
        return {
            date,
            caloriesBurn: entry ? entry.caloriesBurn : 0, // Utiliser 0 si le jour est manquant
        };
    });

    // Générer les 7 derniers jours consécutifs
    const getLastNDays = (n: number) => {
        const days = [];
        for (let i = n - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split("T")[0]); // Format YYYY-MM-DD
        }
        return days;
    };

    // Obtenez les dates pour cette semaine et la semaine dernière
    const thisWeekDates = getLastNDays(7); // 7 derniers jours
    const lastWeekDates = getLastNDays(14).slice(0, 7); // 7 jours avant

    // Filtrer les données pour chaque semaine
    const getAverageSteps = (dates: string[]) => {
        const filteredEntries = dailyEntries.filter((entry) => dates.includes(entry.date));
        const totalSteps = filteredEntries.reduce((sum, entry) => sum + entry.steps, 0);
        return filteredEntries.length > 0 ? totalSteps / filteredEntries.length : 0; // Éviter division par zéro
    };

    const thisWeekAverage = getAverageSteps(thisWeekDates);
    const lastWeekAverage = getAverageSteps(lastWeekDates);

    // Créer l'objet `data` pour StepsComparison
    const stepsComparisonData = [
        { week: "Cette semaine", steps: Math.round(thisWeekAverage) },
        { week: "La semaine dernière", steps: Math.round(lastWeekAverage) },
    ];

    const mealsData = last7Days.map((date) => {
        const entry = dailyEntries.find((e) => e.date === date);
        return {
            date,
            meals: entry ? entry.meals.length : 0,
        };
    });

    return (
        <div className="chart-wrapper mx-auto flex max-w-6xl flex-col flex-wrap items-start justify-center gap-6 p-6 sm:flex-row sm:p-8">
            <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[22rem] lg:grid-cols-1 xl:max-w-[25rem]">
                <Last7DaysStepsCard />
                {caloriesData ? <WeeklyCalories data={caloriesData} /> : <WeeklyCalories data={[]} />}
            </div>
            <div className="grid w-full flex-1 gap-6 lg:max-w-[20rem]">
                {stepsComparisonData && <StepsComparison data={stepsComparisonData} />}
                {stepsData?.length > 0 && <WalkingDistance data={stepsData} />}

                {user?.userId && token ? (
                    <TodayStat
                        userId={user.userId}
                        date={getFormattedDate()}
                        token={token}
                        dailyCalories={user.calories}
                    />
                ) : (
                    <p className="text-gray-500 text-center">Veuillez vous connecter pour accéder aux données.</p>
                )}
            </div>
            <div className="grid w-full flex-1 gap-6">
                {user?.userId && token ? (
                    <DailyEntryCard
                        userId={user.userId}
                        date={getFormattedDate()}
                        token={token}
                        dailyCalories={user.calories}
                    />
                ) : (
                    <p className="text-gray-500 text-center">Veuillez vous connecter pour accéder aux données.</p>
                )}
                {caloriesData?.length > 0 && <ActiveCalories data={caloriesData} />}
                {caloriesBurnData?.length > 0 && <WeeklyMeals data={caloriesBurnData} />}
            </div>
        </div>
    );
}
