import RegisterForm from "@/features/auth/registerForm";


export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full">
      <main className="relative">
        <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-white min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 py-20 w-full flex items-center justify-center">
            <div className="w-full max-w-md">
              <RegisterForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}