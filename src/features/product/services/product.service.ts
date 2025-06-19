import { FetchProductListParams, ProductItemProps, ProductListResponse, ProductSearchRes } from "@/features/product/services/type"
import axiosInstance from "@/lib/api/Config"
import envConfig from "@/lib/api/envConfig"
import { addProductIdToLocalStorage } from "@/lib/utils/localStorege";
import qs from 'qs';
import { toast } from "react-toastify";

export const fetchProductFlashSaleForm = async (): Promise<ProductItemProps[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/products`, {
        params: {
            isSale: true,
            status: true,
            pageNumber: 1,
            pageSize: 10,
            sortBy: "productId",
            sortOrder: "desc"
        }
    })
    const data = response.data as { content: ProductItemProps[] }
    return data.content
}
export const fetchProductNewForm = async (): Promise<ProductItemProps[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/products`, {
        params: {
            isNew: true,
            status: true,
            pageNumber: 1,
            pageSize: 10,
            sortBy: "productId",
            sortOrder: "desc"
        }
    })
    const data = response.data as { content: ProductItemProps[] }
    return data.content
}
export const fetchProductByCategory = async (categoryId: number): Promise<ProductItemProps[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/products`, {
        params: {
            categoryId: categoryId,
            status: true,
            pageNumber: 1,
            pageSize: 5,
            sortBy: "productId",
            sortOrder: "asc"
        }
    })
    const data = response.data as { content: ProductItemProps[] }
    return data.content
}

export const fetchProductBySlug = async (slug: string): Promise<ProductItemProps | null> => {
    try {
        const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/products/slug/${slug}`)
        return response.data as ProductItemProps
    } catch (error) {
        console.error("Error fetching product by slug:", error);
        return null; // Hoặc throw nếu muốn component bắt lỗi
    }

}



export const fetchProductList = async (params: FetchProductListParams): Promise<ProductListResponse> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/products`, {
        params,
        paramsSerializer: (params) => {
            return qs.stringify(params, {
                arrayFormat: 'repeat' // authorIds=1&authorIds=2
            });
        }
    });

    const data = response.data as {
        content: ProductItemProps[],
        totalElements: number,
        totalPages: number,
        pageNumber: number,
        pageSize: number
    };

    return {
        items: data.content,
        totalPages: data.totalPages,
        totalItems: data.totalElements,
        pageNumber: data.pageNumber,
        pageSize: data.pageSize
    };
}

export const fetchProductsByIds = async (productIds: number[]): Promise<ProductItemProps[]> => {
    if (productIds.length === 0) return []

    const queryString = productIds.map((id) => `id=${id}`).join("&")
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/products/ids?${queryString}`)

    const data = response.data as ProductItemProps[] // hoặc kiểm tra nếu backend trả thêm `content`

    return data
}
export const fetchProductByAuthorIds = async (authorIds: number[]): Promise<ProductItemProps[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/products`, {
        params: {
            authorIds,
            status: true,
            pageNumber: 1,
            pageSize: 10,
            sortBy: "productId",
            sortOrder: "asc"
        },
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    });
    const data = response.data as { content: ProductItemProps[] };
    return data.content;
};
export const fetchProductByPublisherId = async (publisherId: number): Promise<ProductItemProps[]> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/products`, {
        params: {
            publisherId: publisherId,
            status: true,
            pageNumber: 1,
            pageSize: 10,
            sortBy: "productId",
            sortOrder: "asc"
        }
    });
    const data = response.data as { content: ProductItemProps[] };
    return data.content;
};
export const fetchSearchProductName = async (keyword: string): Promise<any> => {
    const response = await axiosInstance.get(`${envConfig.NEXT_PUBLIC_API}/public/products?status=true`, {
        params: {
            keyword: keyword,
            pageNumber: 1,
            pageSize: 10,
            sortBy: "productId",
            sortOrder: "asc"
        },
        paramsSerializer: (params) => {
            return qs.stringify(params, {
                arrayFormat: 'repeat' // authorIds=1&authorIds=2
            });
        }
    });

    const data = response.data as { content: ProductSearchRes[] };
    return data.content;
}
export const addToCart = async (productId: number, quantity: number, userId: number): Promise<void> => {
    try {
        await axiosInstance.put(
            `${envConfig.NEXT_PUBLIC_API}/public/carts`,
            {
                userId,
                productId,
                quantity,
            },
            {
                headers: {
                    accept: "*/*",
                    "Content-Type": "application/json",
                },
            }
        );
        toast.success("Thêm vào giỏ hàng thành công", {
            position: "bottom-right",
            autoClose: 2000,
        });
        addProductIdToLocalStorage(productId);
    } catch (error) {
        console.error("API call error:", error);

        toast.error("Sản phẩm đã có trong giỏ hàng.", {
            position: "bottom-right",
            autoClose: 2000,
        });

        throw error; // Cho phép phần gọi nó xử lý tiếp nếu cần
    }
};