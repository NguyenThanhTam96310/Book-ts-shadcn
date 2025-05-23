"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import styles from "./PublisherShowForm.module.css"
import PublisherItem from "@/components/organisms/PublisherItem"
import { fetchPublishersForm } from "@/features/publisher/services/publisher.service"

const PublisherShowForm = () => {
    const [publishers, setPublisher] = useState<PublisherShowcaseProps[]>([])

    useEffect(() => {
        const loadPublishers = async () => {
            try {
                const data = await fetchPublishersForm()
                setPublisher(data)
            } catch (error) {
                console.error("Lỗi khi load pub:", error)
            }
        }
        loadPublishers()
    }, [])
    const sliderRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const checkScrollButtons = () => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
            setCanScrollLeft(scrollLeft > 0)
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    useEffect(() => {
        checkScrollButtons()
        window.addEventListener("resize", checkScrollButtons)
        return () => window.removeEventListener("resize", checkScrollButtons)
    }, [])

    const scroll = (direction: "left" | "right") => {
        if (sliderRef.current) {
            const scrollAmount = sliderRef.current.clientWidth / 2
            const newScrollLeft =
                direction === "left" ? sliderRef.current.scrollLeft - scrollAmount : sliderRef.current.scrollLeft + scrollAmount

            sliderRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            })

            // Update button states after scrolling
            setTimeout(checkScrollButtons, 300)
        }
    }

    return (
        <section className={styles.container}>
            <div className={styles.sliderContainer}>
                {canScrollLeft && (
                    <button
                        className={`${styles.navButton} ${styles.navButtonLeft}`}
                        onClick={() => scroll("left")}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}

                <div className={styles.slider} ref={sliderRef} onScroll={checkScrollButtons}>
                    {publishers.map((publisher) => (
                        <PublisherItem
                            key={publisher.publisherId}
                            publisherId={publisher.publisherId}
                            publisherName={publisher.publisherName}
                            image={publisher.image}
                        />
                    ))}
                </div>

                {canScrollRight && (
                    <button
                        className={`${styles.navButton} ${styles.navButtonRight}`}
                        onClick={() => scroll("right")}
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>
        </section>
    )
}

export default PublisherShowForm
