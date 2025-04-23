export interface ILoginFormProps {
    username: string
    password: string
}
export interface LoginResponse {
    token: string
    email: string
    userId: number
}
export type User = {
    userId?: string;
    username: string;
    email: string;
    token?: string;
};