import { useState,useEffect } from 'react'
import './App.css'
import AuthPage from './pages/AuthPage'
import MainPage from './pages/MainPage'
import { BrowserRouter, Routes, Route,Navigate  } from 'react-router-dom'
import { getToken, removeToken} from './utils/auth';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/auth" element={<AuthPage/>}/>

        <Route element = {<ProtectedRoute />}>
          <Route path="/main" element={<MainPage/>} />
        </Route>
      
      </Routes>
    </BrowserRouter>
  )
}

export default App
