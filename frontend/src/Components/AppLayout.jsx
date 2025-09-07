import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet, useLocation } from 'react-router-dom'

const AppLayout = () => {
  const location = useLocation();

  // pages where you don’t want Navbar & Footer
  const hideLayout = ["/chat","/whitepaper"];

  const shouldHide = hideLayout.includes(location.pathname);

  return (
    <div className='flex flex-col min-h-screen'>
      {!shouldHide && <Navbar />}   {/* Hide if on chat page */}
      
      <div className='flex flex-1'>
        <Outlet/>
      </div>
      
      {!shouldHide && <Footer />}   {/* Hide if on chat page */}
    </div>
  )
}

export default AppLayout
