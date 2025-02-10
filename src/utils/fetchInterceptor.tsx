export async function fetchWithInterceptor(input: any, init: any) {
    try {
        const response = await fetch(input, init);

        if (response.status === 400 || response.status === 403) {
            if (typeof window !== "undefined") {
                window.location.href = "/auth/sign-in";
            }
            throw new Error("Invalid Token - Redirecting to login");
        }

        return response;
    } catch (error) {
        console.error("Error in fetchWithInterceptor:", error);
        throw error;
    }
}
