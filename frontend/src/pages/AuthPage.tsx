import React , {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/AuthenticationForm/LoginForm';
import RegisterForm from '../components/AuthenticationForm/RegisterForm';

const AuthPage: React.FC = () =>{
    const [isLoginView, setIsLoginView] = useState(true);
    const navigate = useNavigate();

    const handleLoginSuccess= () =>{
        console.log("Login success - navigating to /main");
        navigate('/main')
    }

    const handleSwitchToRegister= () =>{
        setIsLoginView(false)
    }
    const handleSwitchToLogin = () => {
        setIsLoginView(true)
    };

    return(
        <div className='flex w-full h-screen'>
            <div className='w-full flex items-center justify-center bg-gray-100'>
                {isLoginView? (<LoginForm onLoginSuccess = {handleLoginSuccess} onSwitchToRegister = {handleSwitchToRegister} />)
                : (<RegisterForm onSwitchToLogin = {handleSwitchToLogin}/>)}
            </div>
        </div>
    )
}

export default AuthPage;