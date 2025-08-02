import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route,Navigate  } from 'react-router-dom'
import { getToken} from './utils/auth'
import ProtectedRoute from './components/ProtectedRoute'
import UserApplication from './pages/ApplicationPage'
import StatisticsPage from './pages/StatisticsPage'
import UserPage from './pages/UserPage'
import Contact from './pages/Contact'

function App(){
    const isLogin = !!getToken()

    return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={isLogin ? <Navigate to="/main" replace /> : <Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<ProtectedRoute />}>
        <Route path="/main" element={<HomePage />}>
            <Route index element={<Navigate to="applications" replace />} />
            <Route path="applications" element={<UserApplication />} />
            <Route path="statistics" element={<StatisticsPage />} />
            <Route path="user" element={<UserPage />} />
            <Route path="contact" element={<Contact />} />
        </Route>
        </Route>
    </Routes>
    </BrowserRouter>
  )

}

export default App