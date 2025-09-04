import React from 'react'
import { Card, CardContent } from './ui/card'

const InfoCard = ({ title, children }) => {
  return (
     <Card className="rounded-2xl shadow-md border border-green-300 sm:px-10 bg-black text-white">
      <CardContent className="sm:p-10 space-y-4 ">
        <h2 className="text-3xl font-bold">{title}</h2>
     <h3 className='text-lg'>   {children}</h3>
      </CardContent>
    </Card>
  )
}

export default InfoCard