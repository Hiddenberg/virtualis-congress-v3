import StaggeredLoginForm from "@/features/staggeredAuth/components/StaggeredLoginForm";

export default function LoginPage() {
   return (
      <div className="flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 w-full min-h-screen">
         <div className="bg-white shadow-xl p-8 md:p-10 border border-gray-200 rounded-2xl w-full max-w-lg">
            <div className="mb-10 text-center">
               <h1 className="mb-3 font-bold text-gray-800 text-3xl tracking-tight">
                  ¡Bienvenido de nuevo!
               </h1>
               <p className="text-gray-600 text-base leading-relaxed">
                  Ingresa tu correo electrónico para continuar
               </p>
            </div>

            <StaggeredLoginForm />

            <div className="mt-10">
               {/* Divider */}
               <div className="flex items-center my-8">
                  <div className="flex-1 border-gray-300 border-t" />
                  <span className="px-6 font-medium text-gray-500 text-sm">
                     o
                  </span>
                  <div className="flex-1 border-gray-300 border-t" />
               </div>

               {/* Signup prompt */}
               <div className="bg-gradient-to-r from-gray-50 to-blue-50 shadow-sm p-6 border-2 border-gray-200 rounded-2xl text-center">
                  <p className="mb-4 font-semibold text-gray-800 text-lg">
                     ¿No tienes una cuenta?
                  </p>
                  <a
                     href="/signup"
                     className="inline-block bg-gradient-to-r from-gray-700 hover:from-gray-800 to-gray-800 hover:to-gray-900 shadow-lg hover:shadow-xl px-8 py-3 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 duration-200"
                  >
                     Regístrate aquí
                  </a>
               </div>
            </div>
         </div>
      </div>
   );
}
