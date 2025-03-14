'use client'
import { useSession } from 'next-auth/react'
import React from 'react'

const DashboardPage = () => {
  const { data: session } = useSession()

  if (!session) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}</h1>
      <p>Email: {session.user?.email}</p>
    </div>
  )
}

export default DashboardPage