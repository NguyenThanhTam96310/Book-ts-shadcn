import axiosInstance from "./Config"

export async function callApi<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any,
    params?: Record<string, any>
): Promise<T> {
    const token = localStorage.getItem("authToken")
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    const url = `${endpoint}${queryString}`

    try {
        const response = await axiosInstance({
            method,
            url,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : undefined,
            },
            data: body,
        })

        return response.data
    } catch (error) {
        console.error("API call error:", error)
        throw error
    }
}
