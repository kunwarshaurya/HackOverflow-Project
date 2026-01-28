import { useState } from 'react';
import useAuth from '../hooks/useAuth'; // Changed from named import { useAuth }
import Button from './components/utils/uibutton'; // Changed from '@/components/ui/Button'

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, 'password123'); // Hardcoded pass for demo
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-8 border rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input 
          className="w-full mb-4 p-2 border rounded" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
        <Button className="w-full">Sign In</Button>
      </form>
    </div>
  );
}