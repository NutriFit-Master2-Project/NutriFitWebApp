import { API_BASE_URL } from "@/config/api";
import { fetchWithInterceptor } from "./fetchInterceptor";

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
    meals: Meal[];
    date: string;
    createdAt: {
        _seconds: number;
        _nanoseconds: number;
    };
};

export async function updateDailyCalories(
    userId: string,
    token: string,
    date: string,
    _caloriesUser: number
): Promise<number | void> {
    const apiBaseUrl = API_BASE_URL;

    try {
        // Retrieve the daily entry
        const getResponse = await fetchWithInterceptor(`${apiBaseUrl}/daily_entries/${userId}/entries/${date}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token,
            },
        });

        if (!getResponse.ok) {
            throw new Error("Error retrieving daily entry data.");
        }

        const dailyEntry: DailyEntry = await getResponse.json();

        // Calculate the new calories
        const caloriesFromMeals = dailyEntry.meals.reduce((sum, meal) => sum + meal.calories, 0);
        // const updatedCalories = caloriesUser - caloriesFromMeals;
        const updatedCalories = caloriesFromMeals;

        // Update the daily entry calories
        const putResponse = await fetchWithInterceptor(`${apiBaseUrl}/daily_entries/${userId}/entries/${date}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token,
            },
            body: JSON.stringify({
                calories: Number(updatedCalories.toFixed(0)),
            }),
        });

        if (!putResponse.ok) {
            throw new Error("Error updating daily entry data.");
        }

        console.log(`Calories updated for ${date}: ${updatedCalories}`);

        return Number(updatedCalories.toFixed(0));
    } catch (error) {
        console.error("Error updating calories: ", error);
    }
}
