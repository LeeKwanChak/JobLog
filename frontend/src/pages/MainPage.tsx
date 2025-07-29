import React from 'react';
import { useNavigate} from 'react-router-dom';
import { removeToken } from '../utils/auth';
import { MdOutlineDashboard, MdLogout } from 'react-icons/md';
import { RiSettings4Line } from 'react-icons/ri';
import { FaChartSimple } from "react-icons/fa6";
import { LuContactRound } from "react-icons/lu";
import Sidebar from '../components/Sidebar/Sidebar.tsx';
import Dashboard from '../components/Dashboard/Dashboard.tsx';

interface User {
    id: number;
    username: string;
    email: string;
}

export interface Application{
    id:number
    companyName: string
    jobTitle: string
    applyDate: string
    requiredSkills: string
    applicationStatus: string
}

const MainPage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () =>{
        removeToken()
        navigate('/auth')
    }

    const menus =[
        {name: "Application", link:'/', icon: MdOutlineDashboard},
        {name: "Statistic", link:'/', icon: FaChartSimple},
        {name: "Setting", link:'/', icon: RiSettings4Line},
        {name: "Logout", link:'/', icon: MdLogout, action: handleLogout},
        {name: "Contact Me", link:'/', icon: LuContactRound, margin: true},
    ]

    return(
        <section className='flex'>
            <Sidebar menus={menus} />
            <Dashboard />
        </section>

    )
}
export default MainPage;