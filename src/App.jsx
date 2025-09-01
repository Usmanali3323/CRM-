
import './App.css'


import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Toaster } from 'react-hot-toast'

import Dashboard from './pages/home'


function App() {
 

  return (
    <>
    <BrowserRouter>

    <Routes>
      <Route path='/' element={<Dashboard/>}/>

    </Routes>
    <Toaster/>
    </BrowserRouter>
    </>
  )
}

export default App
