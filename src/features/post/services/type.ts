export interface PostItemRes {
    postId?: number
    content: string
    image: string
    title: string
    slug?: string
    type?: string
    topic?: TopicRes
    createdAt: number
    status?: boolean
}

export interface TopicRes {
    topicId?: number
    topicName: string
    image: string
    description: string
    slug?: string
}

