"use server"
import { SignedOut } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'


export default async function  getUserId(){
    const { userId, redirectToSignIn } = await auth()
    if (!userId) return redirectToSignIn()

    return(
        <div>
            <div className="flex items-center space-x-4">
            {userId ? (
              <button
                // onClick={handleLogout}
                className="text-white flex items-center space-x-2 bg-red-600 px-3 py-2 rounded-lg shadow-md hover:bg-red-500 transition-all duration-300"
              >
                <SignedOut/>
                {/* <LogOut className="w-5 h-5" /> */}
                <span>Logout</span>
              </button>
            ) : (
              <button
                // onClick={handleLogin}
                className="text-white flex items-center space-x-2 bg-green-600 px-3 py-2 rounded-lg shadow-md hover:bg-green-500 transition-all duration-300"
              >
                {/* <LogIn className="w-5 h-5" /> */}
                <span>Login</span>
              </button>
            )}

            {/* Profile Button */}
            <button
            //   onClick={() => router.push('/profile')}s
              className="text-white hover:text-gray-200 transition-all duration-300"
            >
              {/* <User className="w-6 h-6" /> */}
            </button>
          </div>
        </div>
    )
}