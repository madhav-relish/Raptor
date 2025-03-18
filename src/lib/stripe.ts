'use server'

import { auth } from "@/server/auth"

export async function createCheckoutSession(credits: number){
    const session = await auth()
    if(!session?.user){
        throw new Error("Unauthorized")
    }
}