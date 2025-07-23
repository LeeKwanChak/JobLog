import React , {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

interface AuthPageProps{
    onLoginSuccess: () => void;
}

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
        <div>
            {isLoginView? (<LoginForm onLoginSuccess = {handleLoginSuccess} onSwitchToRegister = {handleSwitchToRegister} />)
            : (<RegisterForm onSwitchToLogin = {handleSwitchToLogin}/>)}
        </div>
    )
}

export default AuthPage;