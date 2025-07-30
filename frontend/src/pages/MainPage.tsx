import React from 'react';
import { useNavigate} from 'react-router-dom';
import { removeToken } from '../utils/auth';
import { MdOutlineDashboard, MdLogout } from 'react-icons/md';
import { FaChartSimple } from "react-icons/fa6";
import { LuContactRound } from "react-icons/lu";
import Sidebar from '../components/Sidebar/Sidebar.tsx';
import UserApplication from './UserApplication.tsx';
import { FaUser } from "react-icons/fa";

const MainPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () =>{
        removeToken()
        navigate('/auth')
    }

    const menus =[
        {name: "Application", link:'/', icon: MdOutlineDashboard},
        {name: "Statistic", link:'/', icon: FaChartSimple},
        {name: "User", link:'/', icon: FaUser},
        {name: "Logout", link:'/', icon: MdLogout, action: handleLogout},
        {name: "Contact Me", link:'/', icon: LuContactRound, margin: true},
    ]

    return(
        <section className='flex'>
            <Sidebar menus={menus} />
            <UserApplication />
        </section>

    )
}
export default MainPage;