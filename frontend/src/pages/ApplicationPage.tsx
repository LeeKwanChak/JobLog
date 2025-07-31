import React , {useState, useEffect, type FormEvent} from 'react';
import { IoMdMore } from "react-icons/io";
import api from '../utils/api.ts';
import UpdateForm from '../components/PopupForm/UpdateForm.tsx'
import type { Application } from '../types.ts';
import { IoMdAddCircleOutline } from "react-icons/io";
import CreateForm from '../components/PopupForm/CreateForm.tsx'
import { IoFilter } from "react-icons/io5";



interface AutofillRequest{
    url: string;
}

const UserApplication: React.FC = () =>{
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
        url: ''
    });

    const [openAppMenuId, setOpenAppMenuId] = useState<number | null>(null)
    const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false)
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false)

    async function fetchAllApplications(){
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
        fetchAllApplications();
    }, []);

    async function handleCreateApplication(e:FormEvent){
        e.preventDefault()
        setError(null)
        try{
            const response = await api.post<Application>('/applications', newApplication)
            fetchAllApplications();
            setNewApplication({
                companyName: '',
                jobTitle: '',
                applyDate: '',
                requiredSkills: '',
                applicationStatus: '',
                url: ''
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
            await fetchAllApplications();
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

    async function handleDelete(applicationId : number){
        setError(null)
        try{
            await api.delete(`/api/applications/${applicationId}`)
            console.log("Application delete successful")
            fetchAllApplications()
            setOpenAppMenuId(null)
        }catch(err:any){
            if(err.response){
                setError(err.response.data.message || "Error when deleting application")
            }else if(err.request){
                setError("Network error: cannot connent to server")
            }else{
                setError('An unexpected error occurred.')
            }
        }
    }

    function handleUpdate(applicationId: number){
        const appToUpdate = applications.find(app => app.id === applicationId)
            if(appToUpdate){
                setSelectedApplication(appToUpdate)
                setShowUpdateForm(true);
                setOpenAppMenuId(null);
        }
    }

    function getStatusStyle(status: string): string{
    switch(status){
        case 'Applied':
            return 'bg-sky-400 text-white';
        case 'Interviewing':
            return 'bg-yellow-400 text-white';
        case 'Offered':
            return 'bg-green-400 text-white';
        case 'Rejected':
            return 'bg-red-400 text-white'; 
        default:
            return '';
        }
    }

    function getFavicon(websiteUrl: string): string {
        try{
            const domain = new URL(websiteUrl).hostname;
            return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
        }catch{
            return '';
        }
    }   

    return(
        <div className='flex-1'>

            <main className = "overflow-x-hidden bg-gray-50 min-h-screen pl-2 pr-2">
                <div className='flex justify-between p-3 mb-4 mt-3'>
                    <p className='text-2xl mt-1 hidden md:block whitespace-nowrap'>My Applications</p>
                    <form onSubmit={AIAutofill} className='w-full max-w-xl'>
                        <input type="text" 
                            placeholder='Paste the url here, let AI create application for you!'
                            className='w-full max-w-xl shadow appearance-none border rounded py-2 px-3 text-gray-700 bg-white'
                            disabled={autofillLoading}
                            value={urlToAutofill}
                            onChange={(e) => setUrlToAutofill(e.target.value)}
                        />
                    </form>
                    <div className='inline-flex gap-2'>
                        <button className=' flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm transition ml-2' onClick ={handleCreateApplication}><IoFilter /><span className="text-sm font-medium">Filter</span></button>
                        <button className=' flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm transition' 
                            onClick ={() => setShowCreateForm(true)}
                            ><IoMdAddCircleOutline /><span className="text-sm font-medium">Create</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-500 text-lg">Loading job applications...</div>
                ) : (

                    applications.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {applications.slice().reverse().map((app) => (
                                <div key={app.id} className="relative bg-white p-5 rounded-xl shadow-lg border border-gray-200 hover:bg-gray-100 transition duration-300 ease-in-out ml-1 mr-1">
                                    <button onClick={(e) => {
                                        e.isPropagationStopped
                                        setOpenAppMenuId(openAppMenuId === app.id ? null : app.id);
                                    }}
                                    className="absolute top-4.5 right-2 p-1 rounded-full hover:bg-gray-200 cursor-pointer">
                                        <IoMdMore size={24} className="text-gray-600" />
                                    </button>

                                    {openAppMenuId === app.id && (
                                        <div className='absolute top-10 right-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10'>
                                            <button onClick={() => handleUpdate(app.id)} className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Update</button>
                                            <button onClick={() => handleDelete(app.id)} className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>Delete</button>
                                        </div>
                                    )}
                                    <p className="text-gray-600 text-sm">{app.applyDate}</p>
                                    {/* <p className="text-lg font-bold text-gray-900 mt-2"><span className="font-semibold">{app.companyName}</span></p> */}
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
                                    {/* <p className="text-gray-600 text-sm mt-2">Status: <span className="font-medium text-gray-800">{app.applicationStatus}</span></p> */}
                                    <p className="text-sm mt-3">
                                        Status:
                                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(app.applicationStatus)}`}>
                                            {app.applicationStatus}
                                        </span>
                                    </p>
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
                
                {showUpdateForm && selectedApplication && (
                    <UpdateForm 
                        application={selectedApplication}
                        onClose={() => {
                            setShowUpdateForm(false);
                            setSelectedApplication(null)
                        }}
                        onUpdateSuccess={() => {
                            fetchAllApplications()
                            setShowUpdateForm(false)
                            setSelectedApplication(null)
                        }}
                        onError={setError}
                    />
                )}

                {showCreateForm && (
                    <CreateForm
                        onClose={() => setShowCreateForm(false)}
                        onCreateSuccess={() => {
                            fetchAllApplications()
                            setShowCreateForm(false)}
                        }
                        onError={setError}
                    />
                )
                }
                
            </main>
        </div>
    )
}
export default UserApplication