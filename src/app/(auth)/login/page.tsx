'use client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import LoginForm from '@/features/auth/components/LoginForm'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoginForm />
        </div>
    )
}
