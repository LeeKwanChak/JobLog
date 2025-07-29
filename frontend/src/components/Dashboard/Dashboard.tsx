import React , {useState, useEffect, type FormEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdMore } from "react-icons/io";
import api from '../../utils/api';


export interface Application{
    id:number
    companyName: string
    jobTitle: string
    applyDate: string
    requiredSkills: string
    applicationStatus: string
}

interface AutofillRequest {
    url: string;
}

const Dashboard = () =>{
    const [applications, setApplications] = useState<Application[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [urlToAutofill, setUrlToAutofill] = useState<string>('');
    const [autofillLoading, setAutofillLoading] = useState<boolean>(false)

    const [newApplication, setNewApplication] = useState<Omit<Application, 'id'>>({
        companyName: '',
        jobTitle: '',
        applyDate: new Date().toISOString().split('T')[0],
        requiredSkills: '',
        applicationStatus: 'Applied',
    });



    async function fetchAllJobs(){
        setError(null)
        setLoading(true)
        try{
            const response = await api.get<Application[]>('/api/applications/all')
            setApplications(response.data)
            console.log("Fetched applications:", response.data);
        }catch(err:any){
            if(err.response){
                setError(err.response.data.message || 'Error when fetching application')
            }
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllJobs();
    }, []);

    async function handleAddApplication(e:FormEvent){
        e.preventDefault()
        setError(null)
        try{
            const response = await api.post<Application>('/applications', newApplication)
            fetchAllJobs();
            setNewApplication({
                companyName: '',
                jobTitle: '',
                applyDate: '',
                requiredSkills: '',
                applicationStatus: '',
            });
            console.log(response)
        }catch(err:any){
            if(err.response){
                setError(err.response.data.message || 'Error when adding application.')
            }else{
                setError('An unexpected error occurred.');
            }
        }

    }

    async function AIAutofill(e: FormEvent){
        e.preventDefault()
        setError(null)
        if(!urlToAutofill){
            setError('Please enter a URL for autofill')
            return
        }
        setAutofillLoading(true)
        setUrlToAutofill('') 
        try{
            const requestBody: AutofillRequest = {url: urlToAutofill}
            const response = await api.post<Application>('/api/applications/autofill', requestBody)
            console.log("AI Autofilled application:", response.data);
            await fetchAllJobs();
        }catch(err:any){
            if(err.response){
                setError(err.response.data.message || 'AI Autofill failed.')

            }else if(err.request){
                setError("Network error: cannot connent to server")
            }else{
                setError('An unexpected error occurred.')
            }
        }finally{
            setAutofillLoading(false)
        }

    }


    return(
        <div className='flex-1'>

            <main className = "overflow-x-hidden bg-gray-50 min-h-screen">
                <div className='flex justify-between p-3 mb-4 mt-3'>
                    <p className='text-2xl mt-1 hidden md:block'>My Applications</p>
                    <form onSubmit={AIAutofill} className='w-full max-w-xl'>
                        <input type="text" 
                            placeholder='Paste the url here, let AI add application for you!'
                            className='w-full max-w-xl shadow appearance-none border rounded py-2 px-3 text-gray-700 bg-white'
                            disabled={autofillLoading}
                            value={urlToAutofill}
                            onChange={(e) => setUrlToAutofill(e.target.value)}
                        />
                    </form>
                    <div className='inline-flex gap-4'>
                        <button className=' rounded-2xl p-3 cursor-pointer bg-gray-100 hover:bg-gray-300 hidden md:block' onClick ={handleAddApplication}>Filter</button>
                        <button className=' rounded-2xl p-3 cursor-pointer bg-gray-100 hover:bg-gray-300 hidden md:block' onClick ={handleAddApplication}>+ Add</button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-500 text-lg">Loading job applications...</div>
                ) : (

                    applications.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {applications.slice().reverse().map((app) => (
                                <div key={app.id} className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:bg-gray-100 transition duration-300 ease-in-out ml-2 mr-2">
                                    <button className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 cursor-pointer">
                                        <IoMdMore size={24} className="text-gray-600" />
                                    </button>
                                    <p className="text-lg font-bold text-gray-900 mb-2"><span className="font-semibold">{app.companyName}</span></p>
                                    <h3 className="text-gray-700 text-lg mt-3">{app.jobTitle}</h3>
                                    <p className="text-gray-600 text-sm mt-3">Applied: {new Date(app.applyDate).toLocaleDateString()}</p>
                                    <p className="text-gray-600 text-sm mt-3">Status: <span className="font-medium text-gray-800">{app.applicationStatus}</span></p>
                                    {/* <p className="text-gray-600 text-sm mt-3">Required Skills: <span className="font-medium text-gray-800">{app.requiredSkills}</span></p> */}
                                    
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 text-lg">
                            {!error && "No job applications found. Click '+ Add Job' to get started!"}
                        </div>
                    )
                )}
            </main>
        </div>
    )
}
export default Dashboard