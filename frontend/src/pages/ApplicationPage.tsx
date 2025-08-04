import React , {useState, useEffect, type FormEvent} from 'react';
import api from '../utils/api.ts';
import UpdateForm from '../components/PopupForm/UpdateForm.tsx'
import type { Application } from '../types.ts';
import { IoMdAddCircleOutline } from "react-icons/io";
import CreateForm from '../components/PopupForm/CreateForm.tsx'
import { IoFilter } from "react-icons/io5";
import ApplicationPopup from '../components/PopupForm/ApplicationPopup.tsx';
import ApplicationCard from '../components/ApplicationCard/ApplicationCard.tsx';


interface AutofillRequest{
    url: string;
}

const UserApplication: React.FC = () =>{
    const [applications, setApplications] = useState<Application[]>([]);
    const [error, setError] = useState<string|null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [urlToAutofill, setUrlToAutofill] = useState<string>('');
    const [autofillLoading, setAutofillLoading] = useState<boolean>(false)
    const [openAppMenuId, setOpenAppMenuId] = useState<number | null>(null)
    const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false)
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
    const [showCreateForm, setShowCreateForm] = useState<boolean>(false)
    const [showApplicationPopup, setShowApplicationPopup] = useState<boolean>(false)
    const [selectedApplicationPopup, setSelectedApplicationPopup] = useState<Application | null>(null)
    const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false)
    const [statusFilter, setStatusFilter] = useState<string>('All')

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

    function handleViewDetails(application: Application){
        setSelectedApplicationPopup(application);
        setShowApplicationPopup(true);
        setOpenAppMenuId(null);
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
    const filteredApplications = statusFilter === 'All'? applications: applications.filter(app => app.applicationStatus === statusFilter);

    return(
        <div className='flex-1'>
            <main className = "overflow-x-hidden bg-gray-50 min-h-screen pl-2 pr-2 pb-4">
                <div className='flex justify-between p-3 mb-4 mt-3'>
                    <p className='text-2xl mt-1 mr-1 hidden md:block whitespace-nowrap'>My Applications</p>
                    <form onSubmit={AIAutofill} className='w-full max-w-xl'>
                        <div className="relative flex items-center">
                            <input type="text" 
                                placeholder='Paste job URL to auto-add an application'
                                className='w-full max-w-xl shadow appearance-none border rounded py-2 px-3 text-gray-700 bg-white'
                                disabled={autofillLoading}
                                value={urlToAutofill}
                                onChange={(e) => setUrlToAutofill(e.target.value)}
                            />
                            {autofillLoading && (
                                <div className="absolute right-0 flex items-center pr-3">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-sky-500"></div>
                                </div>
                            )}
                        </div>
                    </form>
                    <div className='inline-flex gap-2'>
                        <button className=' flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-sm transition ml-2' onClick ={() => setShowFilterDropdown(!showFilterDropdown)}><IoFilter /><span className="hidden sm:inline text-sm font-medium">Filter</span></button>

                        {showFilterDropdown && (
                            <div className='absolute top-17 right-20 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10'>
                                {['All', 'Applied', 'Interviewing', 'Offered' , 'Rejected'].map(status =>(
                                    <button key={status} onClick={() => {setStatusFilter(status); setShowFilterDropdown(false)}} className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                        {status}
                                    </button>
                                ) )}
                            </div>
                        )
                        }
                        <button className=' flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-sm transition' 
                            onClick ={() => setShowCreateForm(true)}
                            ><IoMdAddCircleOutline /><span className="hidden sm:inline text-sm font-medium">Add</span>
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-gray-500 text-lg">Loading job applications...</div>
                ) : (

                    applications.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredApplications.map((app) => (
                                <ApplicationCard
                                    key = {app.id}
                                    app= {app}
                                    openAppMenuId = {openAppMenuId}
                                    onToggleMenu={(id) => setOpenAppMenuId(openAppMenuId === id ? null : id)}
                                    onUpdate={handleUpdate}
                                    onDelete={handleDelete}
                                    onViewDetails={handleViewDetails}
                                    getStatusStyle={getStatusStyle}
                                    getFavicon={getFavicon}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500 text-lg">
                            {!error && "No job applications found. Click '+ Add' or Paste an URL to get started!"}
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

                {showApplicationPopup && selectedApplicationPopup &&(
                    <ApplicationPopup
                        application = {selectedApplicationPopup}
                        onClose = {() => {setShowApplicationPopup(false)
                            setSelectedApplicationPopup(null)}}
                    />
                )
                }
                
            </main>
        </div>
    )
}
export default UserApplication