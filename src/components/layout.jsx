import React from 'react'
import Sidebar from './admin/sideBar'
import Header from './header'

function Layout({children,title}) {
  return (
    <>
    <div className='grid grid-cols-4'>
    <Sidebar/>
    <div className='col-start-2 col-end-4'>
    <Header title={title}/>
    {children}
    </div>
    </div>
    </>
  )
}

export default Layout