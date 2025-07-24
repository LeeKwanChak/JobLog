import { useState,useEffect } from 'react'
import AuthPage from './pages/AuthPage'
import MainPage from './pages/MainPage'
import { BrowserRouter, Routes, Route,Navigate  } from 'react-router-dom'
import { getToken} from './utils/auth';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLogin, setIsLogin] = useState<boolean>(false);

    useEffect(() => {
    if (getToken()) {
      setIsLogin(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isLogin ? <Navigate to="/main" replace /> : <Navigate to="/auth" replace />}/>

        <Route path ="/auth" element={<AuthPage/>}/>

        <Route element = {<ProtectedRoute />}>
          <Route path="/main" element={<MainPage/>} />
        </Route>
      
      </Routes>
    </BrowserRouter>
  )
}

export default App