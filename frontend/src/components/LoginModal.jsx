import React, { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { LogIn } from 'lucide-react';
import { apiService } from '../services/api';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await apiService.login({
        email: email.trim(),
        password: password
      });

      onLoginSuccess(res.user);
      setEmail('');
      setPassword('');
      onClose();
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Account Login"
    >
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <LogIn className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Sign in to TeamTask</h3>
          <p className="text-xs text-gray-500">Enter your credentials to access the dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            id="email"
            type="email"
            required
            placeholder="e.g. alex.j@company.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
          />

          <Input
            label="Password"
            id="password"
            type="password"
            required
            placeholder="Enter password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null); }}
          />

          <Button type="submit" disabled={loading} className="w-full gap-2">
            <LogIn className="w-4 h-4" /> {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </Modal>
  );
}
