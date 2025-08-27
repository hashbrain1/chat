import React from 'react'
import Home from './Components/Home'
import Chat from './Components/Chat'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './Components/AppLayout'

const App = () => {
  const router = createBrowserRouter([
    {
      path:"/",
      element:<AppLayout/>,
      children:[
        {
           path:"/",
      element:<Home/>,
        },
         {
           path:"/chat",
      element:<Chat/>,
        },
      ]

    }
  ])
  return (
<>
   <RouterProvider router={router}/>
</>
  )
}

export default App