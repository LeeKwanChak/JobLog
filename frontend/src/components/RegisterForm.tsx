import React , {useState} from 'react';
import api from '../utils/api';

interface RegisterFormProps{
    onSwitchToLogin: () => void;
}


const RegisterForm: React.FC<RegisterFormProps> = ({onSwitchToLogin}) =>{
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async  (e: React.FormEvent) => {
        e.preventDefault()
        setError(null);
        if(password !== confirmPassword){
            setError('Passwords do not match')
            return;
        }
        setError('');
    
        try{
            const response = await api.post('/api/auth/signup',{
                username,
                email,
                password
            })
            const data = response.data;
            console.log('Registration successful:', data);
            alert('Registration successful!');
            onSwitchToLogin();
        }catch(err:any){
            console.error('Registration failed:', err);
            if(err.response){
                setError(err.response.data.message );
            } else if(err.request){
                setError('Network error or server is unreachable.');
            } else{
                setError('An unexpected error occurred.');
            }
        }finally{
        }
    }

    return (
        <div className=' px-12 py-12 rounded-3xl bg-white shadow-2xl'>
            <div className='text-center'>
                <p className='text-2xl font-semibold'>Job Application Tracker</p>
                <p className='mt-4 text-gray-600'>Hello! Sign up to continue</p>
            </div>
            <form onSubmit={handleSubmit} className='mt-8'>
                <div>
                    <span>Username</span>
                    <input className='w-full border-1 border-gray-300 rounded-xl p-3 bg-transparent mb-2'
                        type = "text"
                        id = "username"
                        value = {username}
                        onChange={(e) => setUsername(e.target.value)}
                        required />
                </div>
                <div>
                    <span>Email</span>
                    <input className='w-full border-1 border-gray-300 rounded-xl p-3 bg-transparent mb-2'
                        type = "email"
                        id = "email"
                        value = {email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                </div>
                <div>
                <span>Password</span>
                <input className='w-full border-1 border-gray-300 rounded-xl p-3 bg-transparent mb-2'
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <div>
                    <span>Confirmed Password</span>
                    <input className='w-full border-1 border-gray-300 rounded-xl p-3 bg-transparent mb-2'
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p>{error}</p>}
                <div className='mt-3 flex flex-col'>
                    <button type="submit" className='bg-blue-500 text-white mb-2 rounded-xl py-3 cursor-pointer hover:bg-blue-600'>Sign up</button>
                    <p className='text-center'>
                        Already have an account?{' '}
                        <span onClick = {onSwitchToLogin} className='text-blue-400 cursor-pointer hover:underline'>Sign in</span>
                    </p>
                </div>
                
            </form>
            
        </div>
    )
}

export default RegisterForm;