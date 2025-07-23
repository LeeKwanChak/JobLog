import React , {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';

interface MainPageProps {
    onLogout: () => void;
}

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const handleLogout = () =>{
        removeToken()
        navigate('/auth')
    }
    return(
        <div>
            <p>Main Page</p>
            <button onClick = {handleLogout}>Logout</button>

        </div>
        
    )
}
export default MainPage;