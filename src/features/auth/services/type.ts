import { AddressRes } from "@/features/profile/services/type"

export interface ILoginFormProps {
    username: string
    password: string
}
export interface LoginResponse {
    token: string
    email: string
    userId: number
}
export type UserProps = {
    userId?: string
    username: string
    fullName: string
    email?: string
    avatar?: string
    mobileNumber?: string
    address: AddressRes
};