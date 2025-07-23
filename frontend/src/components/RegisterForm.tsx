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
        <div>
            <p>Sign up Form</p>
            <form onSubmit={handleSubmit}>
                <input
                    type = "text"
                    id = "username"
                    value = {username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder= "Username"
                    required />
                    
                <input
                    type = "email"
                    id = "email"
                    value = {email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder= "Email"
                    required />

                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />

                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                    />
                {error && <p>{error}</p>}
                <button type="submit">Sign up</button>
            </form>
            <p>
                Already have an account?{' '}
                <span onClick = {onSwitchToLogin}>Sign in</span>
            </p>
            
        </div>
    )
}

export default RegisterForm;