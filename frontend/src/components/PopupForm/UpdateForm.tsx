import React, { useState, type FormEvent, useEffect } from 'react';
import api from '../../utils/api';
import type { Application } from '../../types';

interface UpdateFormProps{
    application: Application | null
    onClose: () => void
    onUpdateSuccess: () => void
    onError: (message: string | null) => void
}

const UpdateForm: React.FC<UpdateFormProps> = ({ application, onClose, onUpdateSuccess, onError }) => {
    const [formData, setFormData] = useState<Omit<Application, 'id'>>({
        companyName: '',
        jobTitle: '',
        applyDate: '',
        requiredSkills: '',
        applicationStatus: '',
        url:''
    });
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (application){
            setFormData({
                companyName: application.companyName,
                jobTitle: application.jobTitle,
                applyDate: application.applyDate,
                requiredSkills: application.requiredSkills,
                applicationStatus: application.applicationStatus,
                url: application.url
            });
        }
    }, [application])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!application) return
        setLoading(true)
        onError(null)

        try {
            await api.put(`/api/applications/${application.id}`, formData);
            onUpdateSuccess()
            onClose()
        } catch (err: any){
            if (err.response){
                onError(err.response.data.message || 'error when updating info')
            } else if(err.request) {
                onError("Network problem, cannot connect to server")
            } else{
                onError('an unexpected problem occurred')
            }
        } finally{
            setLoading(false)
        }
    }

    if (!application) return null
    
    return(
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3 relative">
                <h2 className="text-2xl font-bold mb-4">Update Info</h2>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold"
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="URL" className="block text-gray-700 text-sm font-bold mb-2">
                            URL:
                        </label>
                        <input
                            type="text"
                            id="url"
                            name="url"
                            value={formData.url}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="companyName" className="block text-gray-700 text-sm font-bold mb-2">
                            Company Name:
                        </label>
                        <input
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none "
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="jobTitle" className="block text-gray-700 text-sm font-bold mb-2">
                            Job Title:
                        </label>
                        <input
                            type="text"
                            id="jobTitle"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="applyDate" className="block text-gray-700 text-sm font-bold mb-2">
                            Apply date:
                        </label>
                        <input
                            type="date"
                            id="applyDate"
                            name="applyDate"
                            value={formData.applyDate}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="requiredSkills" className="block text-gray-700 text-sm font-bold mb-2">
                            Requirement:
                        </label>
                        <textarea
                            id="requiredSkills"
                            name="requiredSkills"
                            value={formData.requiredSkills}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                            rows={3}
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="applicationStatus" className="block text-gray-700 text-sm font-bold mb-2">
                            Application Status:
                        </label>
                        <select
                            id="applicationStatus"
                            name="applicationStatus"
                            value={formData.applicationStatus}
                            onChange={handleChange}
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                        >
                            <option value="Applied">Applied</option>
                            <option value="Interviewing">Interviewing</option>
                            <option value="Offered">Offered</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                            disabled={loading}
                        >
                            {loading ? 'Updating' : 'Update'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateForm;