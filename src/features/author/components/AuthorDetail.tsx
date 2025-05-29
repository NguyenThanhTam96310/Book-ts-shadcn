'use client'

import { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './authorDetail.module.css'
import { useRouter } from 'next/navigation'
import { AuthorRes } from '@/features/author/services/type'

interface AuthorDetailProps {
    author: AuthorRes
}

const AuthorDetail: FC<AuthorDetailProps> = ({ author }) => {
    const router = useRouter()

    // Theo dõi vị trí cuộn
    useEffect(() => {
        const handleScroll = () => {
            const infoColumn = document.querySelector(`.${styles.infoColumn}`);
            if (infoColumn) {
                const infoColumnHeight = infoColumn.scrollHeight; // Chiều cao thực của infoColumn
                const windowHeight = window.innerHeight; // Chiều cao viewport
                const scrollTop = window.scrollY; // Vị trí cuộn hiện tại

                // Khi cuộn gần hết infoColumn, cho phép cuộn toàn trang
                if (scrollTop + windowHeight >= infoColumnHeight) {
                    document.body.style.overflowY = 'auto'; // Cuộn toàn trang
                } else {
                    // Giới hạn cuộn trong vùng infoColumn (nếu muốn)
                    // Lưu ý: CSS hiện tại không hỗ trợ hoàn toàn điều này, cần thêm container cha
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            <div className={styles.container}>
                <div className={styles.flexRow}>
                    {/* Ảnh */}
                    <div className={styles.imageBox}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_FILE}${author.image}` || '/placeholder.png'}
                                alt={""}
                                width={400}
                                height={500}
                                className={styles.imageStyle}
                            />
                        </div>
                    </div>
                    {/* Thông tin */}
                    <div className={styles.infoColumn}>
                        <div className={styles.infoBox}>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold">{author.authorName}</h1>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                                    {author.description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorDetail;