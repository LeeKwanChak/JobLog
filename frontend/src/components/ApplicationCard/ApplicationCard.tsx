import React from "react";
import type { Application } from "../../types";
import { IoMdMore } from "react-icons/io";


interface ApplicationCardProps {
    app: Application
    openAppMenuId: number | null 
    onToggleMenu: (appId: number) =>void
    onUpdate: (appId: number) => void
    onDelete: (appId: number) => void
    onViewDetails: (app: Application) => void
    getStatusStyle: (status: string) => string
    getFavicon: (url: string) => string
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
    app,
    openAppMenuId,
    onUpdate,
    onDelete,
    onViewDetails,
    onToggleMenu,
    getStatusStyle,
    getFavicon
    
}) =>{
    return(
        <div key={app.id} 
        className="relative bg-white p-5 rounded-xl shadow-lg border border-gray-200 hover:bg-gray-100 transition duration-300 ease-in-out ml-1 mr-1"
        onClick={() => { 
            if ((window.getSelection() as any)?.toString().length > 0){
                return
            }
            onViewDetails(app)}}>
            <button onClick={(e) => {
                e.stopPropagation();
                onToggleMenu(app.id);
            }}
            className="absolute top-4.5 right-2 p-1 rounded-full hover:bg-gray-200 cursor-pointer">
                <IoMdMore size={24} className="text-gray-600" />
            </button>

            {openAppMenuId === app.id && (
                <div className='absolute top-10 right-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10'>
                    <button onClick={(e) => {onUpdate(app.id); e.stopPropagation()} } className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Update</button>
                    <button onClick={(e) =>{onDelete(app.id); e.stopPropagation()} } className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Delete</button>
                </div>
            )}
            <p className="text-gray-600 text-sm">{app.applyDate}</p>
            <p className="text-lg font-bold text-gray-900 mt-2 flex items-center gap-2">
                {app.url && (
                    <img
                        src={getFavicon(app.url)}
                        alt="favicon"
                        className="w-5 h-5 rounded"
                    />
                )}
                <span className="font-semibold">{app.companyName}</span>
            </p>
            <h3 className="text-gray-700 text-lg mt-2">{app.jobTitle}</h3>
            <p className="text-sm mt-3">
                Status:
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(app.applicationStatus)}`}>
                    {app.applicationStatus}
                </span>
            </p>
        </div>
    )
}

export default ApplicationCard