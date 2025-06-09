import { useEffect, useState } from "react";
import { USER_ID } from "@/constants/cartConstants"; // Import constants
import { CARTLENGTH, CARTPRODUCTIDS } from "@/constants/userConstants";

const useCartProductLength = () => {
    const [cartLength, setCartLength] = useState<string>("0");

    useEffect(() => {
        const updateCartLength = () => {
            try {
                // const userId = localStorage.getItem(USER_ID);
                // if (userId) {
                //     // Ưu tiên đọc từ CARTLENGTH (từ server)
                //     const storedCartLength = localStorage.getItem(CARTLENGTH);
                //     if (storedCartLength) {
                //         console.log("Set cartLength from CARTLENGTH:", storedCartLength);
                //         setCartLength(storedCartLength);
                //         return;
                //     }
                // }

                // Nếu không có userId hoặc CARTLENGTH, đọc từ CartProductIds
                const storedRaw = localStorage.getItem(CARTPRODUCTIDS);
                const stored = storedRaw ? JSON.parse(storedRaw) : [];
                if (Array.isArray(stored)) {
                    const length = stored.length.toString();
                    // console.log("Set cartLength from CartProductIds:", length);
                    setCartLength(length);
                } else {
                    console.error("CartProductIds is not an array:", stored);
                    setCartLength("0");
                }
            } catch (error) {
                console.error("Error parsing CartProductIds:", error);
                setCartLength("0");
            }
        };

        // Gọi ban đầu
        updateCartLength();

        // Lắng nghe sự kiện thay đổi
        window.addEventListener("cartProductIdsChanged", updateCartLength);
        window.addEventListener("storage", (event: StorageEvent) => {
            if (event.key === CARTLENGTH || event.key === "CartProductIds") {
                updateCartLength();
            }
        });

        return () => {
            window.removeEventListener("cartProductIdsChanged", updateCartLength);
            window.removeEventListener("storage", updateCartLength);
        };
    }, []);

    return cartLength;
};

export default useCartProductLength;
