"use server"
import { auth } from '@clerk/nextjs/server'

export default async function AuthClerk(){
    const { userId, redirectToSignIn } = await auth();

    return(userId,redirectToSignIn);

}