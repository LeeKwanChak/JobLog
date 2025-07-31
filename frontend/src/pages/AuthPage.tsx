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
            <div className='w-full flex items-center justify-center lg:w-1/2 bg-gray-100'>
                {isLoginView? (<LoginForm onLoginSuccess = {handleLoginSuccess} onSwitchToRegister = {handleSwitchToRegister} />)
                : (<RegisterForm onSwitchToLogin = {handleSwitchToLogin}/>)}
            </div>

            <div className='hidden relative lg:flex h-full w-1/2 items-center justify-center '>
            <div className='absolute top-[12%] left-[70%] -translate-x-4 bg-white px-4 py-2 rounded-lg shadow-lg text-gray-700 font-semibold'>
                Work hard. Dream big.
            </div>

            <div className='absolute top-[23%] left-[16%] -translate-x-4 bg-white px-4 py-2 rounded-lg shadow-lg text-gray-700 font-semibold'>
                Hello!
            </div>

            <div className='absolute top-[76%] left-[16%] -translate-x-4 bg-white px-4 py-2 rounded-lg shadow-lg text-gray-700 font-semibold'>
                "Impossible" is just a perspective, not a fact.
            </div>

                <div className='w-60 h-60 bg-gradient-to-tr  to-pink-500 rounded-full animate-bounce'/>
                <div className='w-full h-1/2 absolute bg-white/10'></div>
            </div>
        </div>
    )
}

export default AuthPage;