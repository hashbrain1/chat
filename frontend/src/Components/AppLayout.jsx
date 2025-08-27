import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import {Outlet} from 'react-router-dom'

const AppLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
       <Navbar/> 
       <div className='flex flex-1 '>
        <Outlet/>
       </div>
       <Footer/>
    </div>
  )
}

export default AppLayout