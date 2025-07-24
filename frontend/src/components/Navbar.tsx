import React from "react";

const NavbarMenu = [
    {
        id:1,
        title: "Home",
        path:"/"
    },
        {
        id:2,
        title: "Statistic",
        link: "#",
    },
        {
        id:3,
        title: "Contact Me",
        path:".../pages/AuthPage/tsx",
    },
]

const Navbar = () =>{
    return(
        <nav className="bg-gray-200">
            <div className="w-full mx-auto px-4 py-6 flex justify-between items-center">
                <div>
                    <h1 className="font-bold text-2xl">Job Application Tracker</h1>
                </div>
                <div className="hidden lg:block">
                    <ul className="flex items-center gap-3">
                        {
                            NavbarMenu.map((menu) => (
                                <li key = {menu.id}>
                                <a href={menu.path} className="inline-block py-2 px-3 hover:text-blue-300 relative group">{menu.title}
                                    <div className="w-2 h-2 bg-blue-300 absolute mr-2 left-1/2 -translate-x-1/2 top-1/2 bottom-0 group-hover:block hidden rounded-full"></div>
                                </a>
                                </li>
                            ))
                        }
                        <button className="inline-block border border-gray-200 font-semibold py-2 px-6 hover:bg-blue-200 rounded-xl">Sign out</button>
                    </ul>
                </div>
            </div>

        </nav>
    )
}

export default Navbar