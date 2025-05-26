"use client"

import React, { useState } from "react"

const ReviewForm = () => {
    const [comment, setComment] = useState("")
    const [star, setStar] = useState(5)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Gửi comment và star lên API
        console.log({ comment, star })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                    <button
                        type="button"
                        key={s}
                        onClick={() => setStar(s)}
                        className={s <= star ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}
                    >
                        ★
                    </button>
                ))}
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Nhập nhận xét của bạn..."
                rows={4}
            />
            <button type="submit" className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600">
                Gửi đánh giá
            </button>
        </form>
    )
}

export default ReviewForm
