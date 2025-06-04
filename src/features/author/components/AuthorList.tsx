'use client';

import AuthorItem from "@/components/organisms/AuthorItem";
import ProductItem from "@/components/organisms/ProductItem";
import { fetchAllAuthors } from "@/features/author/services/author.service";
import { AuthorRes } from "@/features/author/services/type";
import { fetchProductList } from "@/features/product/services/product.service";
import { FetchProductListParams, ProductItemProps, ProductListResponse } from "@/features/product/services/type";
import { useEffect, useState } from "react";

interface ProductListProps {

}

const AuthorList = ({ }: ProductListProps) => {
    const [authors, setAuthors] = useState<AuthorRes[]>([]);


    useEffect(() => {
        const loadAuthors = async () => {

            try {
                const data = await fetchAllAuthors();
                setAuthors(data);
            } catch (error) {
                console.error("Lỗi khi load product:", error);
            }
        };

        loadAuthors();
    }, []);

    return (
        <main className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {authors.map((author) => (
                    <AuthorItem key={author.authorId} author={author} />
                ))}
            </div>

        </main>
    );
};

export default AuthorList;