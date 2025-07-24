import React , {useState, useEffect, type FormEvent} from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';
import api from '../utils/api';
import Navbar from '../components/Navbar';

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
interface AutofillRequest {
    url: string;
}

const MainPage: React.FC = () => {
    const navigate = useNavigate();
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

    const handleLogout = () =>{
        removeToken()
        navigate('/auth')
    }

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
        <main className = "overflow-x-hidden bg-white">
            <div className='flex justify-between p-3 mb-4 mt3'>
                <p className='text-2xl mt-2'>My Applications</p>
                <form onSubmit={AIAutofill} className='w-full max-w-xl'>
                    <input type="text" 
                        placeholder='Paste the url here, let AI add job for you!'
                        className='w-full max-w-xl shadow appearance-none border rounded py-2 px-3 text-gray-700'
                        disabled={autofillLoading}
                        value={urlToAutofill}
                        onChange={(e) => setUrlToAutofill(e.target.value)}
                    />
                </form>
                <button className=' rounded-2xl p-3 cursor-pointer hover:bg-blue-600' onClick ={handleAddApplication}>+ Add Job</button>
            </div>

            {loading ? (
                <div className="text-center py-8 text-gray-500 text-lg">Loading job applications...</div>
            ) : (

                applications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applications.slice().reverse().map((app) => (
                            <div key={app.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out ml-3 mr-3">
                                <p className=" font-bold text-gray-900 mb-2"><span className="font-semibold">{app.companyName}</span></p>
                                <h3 className="text-gray-700 text-lg mt-2">{app.jobTitle}</h3>
                                <p className="text-gray-600 text-sm mt-2">Applied: {new Date(app.applyDate).toLocaleDateString()}</p>
                                <p className="text-gray-600 text-sm mt-2">Status: <span className="font-medium text-gray-800">{app.applicationStatus}</span></p>
                                <p className="text-gray-600 text-sm mt-2">Skills: <span className="font-medium text-gray-800">{app.requiredSkills}</span></p>
                                
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 text-lg">
                        {!error && "No job applications found. Click '+ Add Job' to get started!"}
                    </div>
                )
            )}


            <button onClick = {handleLogout}>Logout</button>
        </main>



    )
}
export default MainPage;