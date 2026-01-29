import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../utils/uibutton';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F4EF] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border-4 border-black p-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-black uppercase text-orange-600 mb-2">Join Campus</h2>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Create a password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-input"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="club_leader">Club Leader</option>
            </select>
          </div>

          <Button 
            type="submit" 
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}