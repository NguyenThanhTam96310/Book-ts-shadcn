"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { fetchBanners } from "@/features/banner/services/home.service"

export default function BannerTop() {
    const [banners, setBanners] = useState<any[]>([])
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const activeBanners = await fetchBanners()
                setBanners(activeBanners)
            } catch (error) {
                console.error("Error fetching banners", error)
            }
        }
        fetchData()
    }, [])

    const mainSlides = banners.filter((b) => b.position === "HOME_TOP")



    return (
        <div className="relative w-full h-[60px] overflow-hidden hidden sm:block"> {/* Chiều cao nhỏ hơn */}
            {mainSlides.map((b, idx) => (
                <Link
                    href={b.link || "#"}
                    key={b.bannerId}
                    className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                >
                    <div className="relative w-full h-full">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_FILE}${b.image}`}
                            alt={b.bannerName}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                </Link>
            ))}
        </div>
    )
}
