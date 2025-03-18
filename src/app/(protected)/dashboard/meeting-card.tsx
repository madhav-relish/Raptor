import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


const MeetingCard = () => {
  return (
    <Card className="relative col-span-2">
    <CardHeader>
      <CardTitle>Summarise a Meeting!</CardTitle>
    </CardHeader>
    <CardContent className='flex items-center justify-center'>
     Coming Soon!
    </CardContent>
  </Card>
  )
}

export default MeetingCard