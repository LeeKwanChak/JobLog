import React from "react";
import type { Application } from '../../types';
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";

interface ApplicationTableProps {
    applications: Application[];
    onUpdate: (appId: number) => void;
    onDelete: (appId: number) => void;
    onViewDetails: (app: Application) => void;
    getStatusStyle: (status: string) => string;
    getFavicon: (url: string) => string;
}
const ApplicationTable: React.FC<ApplicationTableProps> = ({applications, onViewDetails, getFavicon, getStatusStyle, onUpdate, onDelete}) => {
    return(
        <table className="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    <th scope="col" className=" py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apply date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody>
                {applications.map((app) => (
                    <tr key={app.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 cursor-pointer" onClick={() => onViewDetails(app)}>
                        <td>
                            {app.url && (
                                <img className="h-6 w-6 ml-6" src={getFavicon(app.url)} alt="" />
                            )}

                        </td>
                        <td className="py-4 whitespace-nowrap">
                            <div className="flex">
                                {/* <div className="flex-shrink-0 h-10 w-10">
                                    {app.url && (
                                        <img className="h-7 w-7 rounded-full" src={getFavicon(app.url)} alt="" />
                                    )
                                    }
                                </div> */}
                                <div className="text-sm">
                                    {app.companyName}
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{app.jobTitle}</div>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {app.applyDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(app.applicationStatus)}`}>
                            {app.applicationStatus}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onUpdate(app.id);
                                    }}
                                    className="text-gray-400 hover:text-blue-500 cursor-pointer"
                                    aria-label="Edit"
                                >
                                    <MdOutlineModeEdit size={20} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(app.id);
                                    }}
                                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                                    aria-label="Delete"
                                >
                                    <MdDeleteOutline size={20} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))

                }
            </tbody>
        </table>

    )
}

export default ApplicationTable;