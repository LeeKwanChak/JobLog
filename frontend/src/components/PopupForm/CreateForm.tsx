import React ,{type FormEvent, useState} from "react";
import type { Application } from '../../types';
import api from '../../utils/api';

interface CreateFormProps {
    onClose: () => void
    onCreateSuccess: () => void
    onError: (message: string | null) => void
}

const CreateForm: React.FC<CreateFormProps> = ({onClose, onError, onCreateSuccess}) =>{
    const [loading, setLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<Omit<Application, 'id'>>({
        companyName: '',
        jobTitle: '',
        applyDate: new Date().toISOString().split('T')[0],
        requiredSkills: '',
        applicationStatus: 'Applied',
        url:''
    })

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({...prev, [name]: value}))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        onError(null)
        setLoading(true)

        try{
            await api.post<Application>('/api/applications', formData)
            onCreateSuccess()
            onClose
        }catch(err:any){
            if(err.response){
                onError(err.response.data.message)
                console.error(err.response.data.message)
            }else if(err.request){
                onError("Network problem, cannot connect to the server.")
                console.error("Network problem, cannot connect to the server.")
            }else{
                onError('An unexpected problem occurred.')
                console.error('An unexpected problem occurred.')
            }

        }finally{
            setLoading(false)
        }
    }



    return(
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center">
            <div className="bg-white w-11/12 md:w-1/2 lg:w-1/3 relative p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold mb-4">Application Details</h2>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-3 text-gray-500 hover:text-gray-800 text-3xl font-bold"
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
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-sky-400 cursor-pointer text-white font-bold py-2 px-4 rounded focus:outline-none"
                            disabled={loading}
                        >
                            {loading ? 'Creating' : 'Create'}
                        </button>

                        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                            type="button"
                            onClick={() => onClose()}>
                            Cancel
                        </button>
                                    
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CreateForm