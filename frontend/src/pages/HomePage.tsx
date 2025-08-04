import React, {useState} from 'react';
import { useNavigate,Outlet} from 'react-router-dom';
import { removeToken } from '../utils/auth';
import { MdOutlineDashboard, MdLogout } from 'react-icons/md';
import { FaChartSimple } from "react-icons/fa6";
import { LuContactRound } from "react-icons/lu";
import Sidebar from '../components/Sidebar/Sidebar.tsx';
import { FaUser } from "react-icons/fa";

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const handleLogout = () =>{
        removeToken()
        navigate('/auth')
    }

    const menus =[
        {name: "Application", link:'/main/applications', icon: MdOutlineDashboard},
        {name: "Statistics", link:'/main/statistics', icon: FaChartSimple},
        {name: "User", link:'/main/user', icon: FaUser},
        {name: "Logout", link:'/', icon: MdLogout, action: handleLogout},
        {name: "Contact Me", link:'/main/contact', icon: LuContactRound, margin: true},
    ]

    return(
        <section className='flex'>
            <Sidebar menus={menus} open={sidebarOpen} setOpen={setSidebarOpen}/>
            <div className={`flex-1 min-h-screen transition-all duration-500 ${sidebarOpen ? 'ml-72' : 'ml-16'}`}>
                <Outlet />
            </div>
        </section>

    )
}
export default HomePage;