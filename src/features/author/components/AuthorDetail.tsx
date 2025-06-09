'use client'

import { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './authorDetail.module.css'
import { useRouter } from 'next/navigation'
import { AuthorRes } from '@/features/author/services/type'
import ProductByAuthorId from '@/features/product/components/ProductByAuthorId'
import { Card, CardContent } from '@/components/ui/card'
import { BookOpen, Quote } from 'lucide-react'
import { Separator } from '@radix-ui/react-separator'

interface AuthorDetailProps {
    author: AuthorRes
}

const AuthorDetail: FC<AuthorDetailProps> = ({ author }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="container mx-auto px-4 py-8">
                <Card className="mb-8 shadow-lg border-0">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-6">

                            <h2 className="text-2xl font-bold text-gray-900">{author.authorName}</h2>
                        </div>

                        <Separator className="mb-6" />

                        <div className="prose prose-lg max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base lg:text-lg">
                                {author.description || "Thông tin về tác giả đang được cập nhật..."}
                            </div>
                        </div>

                    </CardContent>
                </Card>

                {/* Products Section */}
                <Card className="shadow-lg border-0">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <BookOpen className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Tác phẩm của {author.authorName}</h2>
                        </div>

                        <Separator className="mb-6" />
                        <ProductByAuthorId authorId={author.authorId} />
                    </CardContent>
                </Card>
            </div>
        </div>

    );
};

export default AuthorDetail;