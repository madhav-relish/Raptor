'use server'

import { auth } from "@/server/auth"
import { db } from "@/server/db"

export async function createCheckoutSession(credits: number){
    const session = await auth()
    if(!session?.user){
        throw new Error("Unauthorized")
    }

    await db.creditsTransaction.create({data:{ userId: session.user.id, credits}})
    await db.user.update({where: {id: session.user.id}, data:{credits:{
        increment: credits
    }}})
    return true
}