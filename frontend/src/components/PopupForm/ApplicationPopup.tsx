import React from "react";
import type { Application } from '../../types';

interface ApplicationDetailsPopupProps {
    application: Application;
    onClose: () => void;
}

const ApplicationPopup: React.FC<ApplicationDetailsPopupProps> = ({application, onClose}) => {
    function getFavicon(websiteUrl: string): string {
        try{
            const domain = new URL(websiteUrl).hostname;
            return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
        }catch{
            return '';
        }
    }   

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center">
            <div className="relative bg-white w-11/12 md:w-1/2 lg:w-1/3 max-h-[80vh] overflow-y-auto p-6 rounded-lg shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-semibold mb-2">{application.companyName}</h2>
                <div className="flex items-center gap-2 mb-2">
                {application.url && (
                    <>
                    <img
                        src={getFavicon(application.url)}
                        alt="favicon"
                        className="w-7 h-7"
                    />
                    <a
                        href={application.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate "
                    >
                        {new URL(application.url).hostname}
                    </a>
                    </>
                )}
                </div>
                <div className="space-y-2 text-gray-700">
                    <p><span className="font-semibold text-black">Job Title:</span> {application.jobTitle}</p>
                    <p><span className="font-semibold text-black">Location:</span> {application.location}</p>
                    <p><span className="font-semibold text-black">Salary:</span> {application.salary}</p>
                    <p><span className="font-semibold text-black">Requirement:</span> {application.requiredSkills || '-'}</p>
                </div>
            </div>
        </div>
    )
}

export default ApplicationPopup