import React , {useState} from 'react';
import api from '../utils/api';
import { setToken } from '../utils/auth';
interface LoginFormProps{
    onSwitchToRegister: () => void
    onLoginSuccess: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({onSwitchToRegister,onLoginSuccess}) =>{
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        
        try{
            const response = await api.post('/api/auth/signin',{
                identifier, password
            })
            const data = response.data;
            console.log(data)
            setToken(data.token)
            console.log('JWT Token saved:', data.token)
            console.log("Login response:", data);
            onLoginSuccess();
        }catch(err:any){
            console.error('Login failed.')
            if(err.response.status == 401){
                setError('Invaliad username/email or password')
            }else if(err.request){
                setError('Network error or server is unreachable.')
            }else{
                setError('An unexpected error occured')
            }
        }
    }

    return(
        <div className=' px-12 py-12 rounded-3xl bg-white shadow-2xl'>
            <div className='text-center'>
                <p className='text-2xl font-semibold'>Job Tracker</p>
                <p className='mt-4 text-gray-600'>Welcome back! Sign in to continue</p>
            </div>
            <form onSubmit = {handleSubmit} className='mt-8'>

                <div>
                    <span>Email/Username</span>
                    <input className='w-full border-1 border-gray-300 rounded-xl p-3 bg-transparent mb-2'
                    type="text"
                    id = "identifier"
                    value = {identifier}
                    onChange={ (e) => setIdentifier(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <span>Password</span>
                    <input className='w-full border-1 border-gray-300 rounded-xl p-3 bg-transparent mb-3'
                    type="password"
                    id = "password"
                    value = {password}
                    onChange={ (e) => setPassword(e.target.value)}
                    required
                    />
                </div>

                <div>
                    <input type="checkbox" />
                    <span>  Remember me for 30 days</span>
                </div>
                
                {error && <p>{error}</p>}
                <div className='mt-3 flex flex-col '>
                    <button type = "submit" className='bg-blue-500 text-white mb-2 rounded-xl py-3 cursor-pointer hover:bg-blue-600'>Sign in</button>

                    <p className='text-center'>
                        Do not have an account?{' '}
                    <span onClick = {onSwitchToRegister} className='text-blue-400 cursor-pointer hover:underline'>Sign up</span>
                    </p>                   
                </div>


            </form>
            
        </div>
    )
}

export default LoginForm;