import AuthorDetail from "@/features/author/components/AuthorDetail"
import { fetchAuthorDetail } from "@/features/author/services/author.service"
import { AuthorRes } from "@/features/author/services/type"
import { fetchOrderbyCode } from "@/features/order/services/order.service"
import { OrderRes } from "@/features/order/services/type"
import { fetchPostDetail, PostItemRes } from "@/features/post"
import PostNewHomeForm from "@/features/post/components"
import PostByTopicForm from "@/features/post/components/PostByTopicForm"
import Postdetail from "@/features/post/components/PostDetail"
import OrderDetail from "@/features/profile/components/OrderDetail"
import { useEffect, useState } from "react"

interface Props {
    params: { orderCode: string }
}
export default async function OrderDetailPage({ params }: Props) {
    const { orderCode } = await params
    const order: OrderRes = await fetchOrderbyCode(orderCode)
    return (
        <>
            <OrderDetail order={order} />

        </>
    )
}