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
        <div>
            <p>Sign in Form</p>
            <form onSubmit = {handleSubmit}>
                    <input 
                    type="text"
                    id = "identifier"
                    value = {identifier}
                    onChange={ (e) => setIdentifier(e.target.value)}
                    placeholder = "Email/Username"
                    required
                    />

                    <input 
                    type="password"
                    id = "password"
                    value = {password}
                    onChange={ (e) => setPassword(e.target.value)}
                    placeholder = "Password"
                    required
                    />
                {error && <p>{error}</p>}
                <button type = "submit">Sign in</button>
            </form>
            
            <p>
                Do not have an account?{' '}
            <span onClick = {onSwitchToRegister}>Sign up</span>
            </p>
        </div>
    )
}

export default LoginForm;