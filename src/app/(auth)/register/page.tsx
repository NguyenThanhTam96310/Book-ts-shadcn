import RegisterForm from "@/features/auth/components/RegisterForm"

const RegisterPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-8">
            <div className="w-full max-w-5xl px-4">
                <RegisterForm />
            </div>
        </div>
    )
}
export default RegisterPage