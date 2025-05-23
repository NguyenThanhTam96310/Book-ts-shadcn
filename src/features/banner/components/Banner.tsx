"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { fetchBanners } from "@/features/banner/services/home.service"

export default function Banner() {
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

    const mainSlides = banners.filter((b) => b.position === "SLIDESHOW")

    useEffect(() => {
        if (mainSlides.length === 0) return

        const t = setInterval(() => {
            setCurrent((c) => (c + 1) % mainSlides.length)
        }, 4000)
        return () => clearInterval(t)
    }, [mainSlides.length])

    const prev = () => {
        setCurrent((c) => (c === 0 ? mainSlides.length - 1 : c - 1))
    }

    const next = () => {
        setCurrent((c) => (c === mainSlides.length - 1 ? 0 : c + 1))
    }

    if (mainSlides.length === 0) return null

    return (
        <div className="relative w-full h-[400px] overflow-hidden rounded-lg"> {/* Thêm rounded-lg ở đây */}
            {mainSlides.map((b, idx) => (
                <Link
                    href={b.link || "#"}
                    key={b.bannerId}
                    className={`absolute inset-0 transition-opacity duration-700 ${idx === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                >
                    <div className="relative w-full h-full rounded-lg"> {/* Thêm rounded-lg cho div chứa Image */}
                        <Image
                            src={`${process.env.NEXT_PUBLIC_FILE}${b.image}`}
                            alt={b.bannerName}
                            fill
                            quality={100}
                            className="object-cover rounded-lg"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                        />
                    </div>
                </Link>
            ))}

            {/* Nút điều hướng */}
            <button
                onClick={prev}
                className="absolute top-1/2 left-4 -translate-y-1/2 z-20 bg-white/70 p-2 rounded-full hover:bg-white shadow"
            >
                <ChevronLeft />
            </button>
            <button
                onClick={next}
                className="absolute top-1/2 right-4 -translate-y-1/2 z-20 bg-white/70 p-2 rounded-full hover:bg-white shadow"
            >
                <ChevronRight />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                {mainSlides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-3 h-3 rounded-full ${i === current ? "bg-red-500" : "bg-white/70"} transition-colors`}
                    />
                ))}
            </div>
        </div>
    )
}
