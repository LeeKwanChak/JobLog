import React, {useState} from "react";
import { HiMenuAlt3 } from 'react-icons/hi';
import { Link } from 'react-router-dom';


interface SidebarProps {
    menus: Menu[];
    open: boolean
    setOpen: (open: boolean) => void
}

interface Menu {
    name: string;
    link?: string;
    icon: React.ElementType;
    action?: () => void;
    margin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ menus, open, setOpen  }) =>{

    return(
        <div className={`fixed top-0 left-0 z-0 bg-slate-800 min-h-screen ${open? 'w-62':'w-16'} duration-500 text-white px-4 border-r border-gray-200`}>
            <div className='py-3 flex justify-end'>
                <HiMenuAlt3 size ={26} className='cursor-pointer' onClick={()=> setOpen(!open)}/>
            </div>
            <div className='mt-4 flex flex-col gap-4 relative'>
                {
                    menus?.map((menu,i)=>
                    (menu.action ? (            
                    <button 
                        key={i} 
                        onClick={menu.action}
                        className={`w-full ${menu?.margin && 'mt-5'} group flex items-center text-sm gap-3.5 font-medium p-2 hover:bg-gray-200 rounded-md`}
        >
                    <div>{React.createElement(menu?.icon, { size: "20" })}</div>
                        <h2 style={{ transitionDelay: `${i + 3}00ms` }} className={`whitespace-pre duration-500 ${!open && 'opacity-0 translate-x-28 overflow-hidden'}`}>
                        {menu?.name}
                        </h2>
                    </button>) : (  

                        <Link to= {menu?.link || '#'} key = {i} className={` ${menu?.margin && 'mt-5'} group flex items-center text-sm gap-3.5 font-medium p-2  rounded-md`}>
                            <div>
                                {React.createElement(menu?.icon, {size:"20"})}
                            </div>
                            <h2 style={{transitionDelay: `${i+3}00ms`}} className={`whitespace-pre duration-500 ${!open && 'opacity-0 translate-x-28 overflow-hidden'}`}>
                                {menu?.name}
                            </h2>
                        </Link>) )
                
                        )
                }
            </div>
        </div>

    )
}
export default Sidebar