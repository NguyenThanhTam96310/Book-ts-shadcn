import RegisterForm from "@/features/auth/components/RegisterForm"

const RegisterPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
                <RegisterForm />
            </div>
        </div>
    )
}
export default RegisterPage