export function isTokenExpired(): boolean {
    // Kiểm tra nếu đang chạy trên client-side (có window)
    if (typeof window === "undefined") {
        return false; // Trên server, không thể kiểm tra expiry, trả về false để xử lý sau
    }
    const expiry = localStorage.getItem("authTokenExpiry");
    if (!expiry) return false;

    const now = Date.now();
    const expiryTime = parseInt(expiry, 10);

    // Nếu còn dưới 5 phút là hết hạn → nên refresh
    return expiryTime - now < 5 * 60 * 1000;
}
