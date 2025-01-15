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
    const apiBaseUrl = "https://nutrifitbackend-2v4o.onrender.com/api";

    try {
        // Retrieve the daily entry
        const getResponse = await fetch(`${apiBaseUrl}/daily_entries/${userId}/entries/${date}`, {
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
        const putResponse = await fetch(`${apiBaseUrl}/daily_entries/${userId}/entries/${date}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token,
            },
            body: JSON.stringify({
                ...dailyEntry,
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
