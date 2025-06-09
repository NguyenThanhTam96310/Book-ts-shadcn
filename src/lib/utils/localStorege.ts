export const addProductIdToLocalStorage = (productId: string | number) => {
    const key = "CartProductIds";
    const stored = localStorage.getItem(key);
    const currentIds: (string | number)[] = stored ? JSON.parse(stored) : [];
    // Nếu productId chưa tồn tại thì thêm vào
    if (!currentIds.includes(productId)) {
        currentIds.push(productId);
        localStorage.setItem(key, JSON.stringify(currentIds));
        window.dispatchEvent(new Event("cartProductIdsChanged"));
    }
};

export const removeProductIdFromLocalStorage = (productId: string | number) => {
    const key = "CartProductIds";
    try {
        const storedRaw = localStorage.getItem(key);
        if (!storedRaw) {
            console.log(`No data found for key "${key}" in localStorage`);
            return;
        }

        let currentIds: (string | number)[];
        try {
            currentIds = JSON.parse(storedRaw);
            if (!Array.isArray(currentIds)) {
                console.error(`"${key}" is not an array:`, currentIds);
                return;
            }
        } catch (error) {
            console.error(`Failed to parse "${key}":`, error);
            return;
        }

        const updatedIds = currentIds.filter(id => id !== productId);
        if (updatedIds.length !== currentIds.length) {
            localStorage.setItem(key, JSON.stringify(updatedIds));
            // console.log(`Removed productId ${productId} from "${key}"`);
            window.dispatchEvent(new Event("cartProductIdsChanged"));
        } else {
            console.log(`ProductId ${productId} not found in "${key}"`);
        }
    } catch (error) {
        console.error(`Error in removeProductIdFromLocalStorage:`, error);
    }
};
export const getCartProductIds = (): (string | number)[] => {
    const stored = localStorage.getItem("CartProductIds");
    return stored ? JSON.parse(stored) : [];
};

export const clearCartProductIds = () => {
    localStorage.removeItem("CartProductIds");
};
export const getUniqueProductCount = (): number => {
    const stored = localStorage.getItem("CartProductMap");
    const map: Record<string, number> = stored ? JSON.parse(stored) : {};
    window.dispatchEvent(new Event("cartProductIdsChanged"));
    return Object.keys(map).length;

};