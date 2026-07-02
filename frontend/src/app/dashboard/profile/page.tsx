'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPwd, setIsChangingPwd] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Name is required.'); return; }
    setIsSaving(true);
    try {
      const res = await api.put('/auth/profile', { name });
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch { toast.error('Failed to update profile.'); }
    finally { setIsSaving(false); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match.'); return; }
    setIsChangingPwd(true);
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed successfully!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally { setIsChangingPwd(false); }
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Profile Settings</h1>
        <p className="text-slate-500 mt-1">Manage your account information.</p>
      </div>

      {/* Avatar */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center text-3xl font-black">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-slate-500 text-sm">{user?.email}</p>
            <span className="badge badge-indigo mt-2">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Profile form */}
      <div className="card p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-5">Personal Information</h2>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label htmlFor="profile-name" className="label">Full Name</label>
            <input id="profile-name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" required />
          </div>
          <div>
            <label htmlFor="profile-email" className="label">Email Address</label>
            <input id="profile-email" type="email" value={user?.email || ''} className="input opacity-50 cursor-not-allowed" readOnly />
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
          </div>
          <button type="submit" disabled={isSaving} className="btn-primary w-full sm:w-auto px-6" id="save-profile-btn">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Password change */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-5">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="current-password" className="label">Current Password</label>
            <input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input" required />
          </div>
          <div>
            <label htmlFor="new-password" className="label">New Password</label>
            <input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 6 characters" className="input" required />
          </div>
          <div>
            <label htmlFor="confirm-new-password" className="label">Confirm New Password</label>
            <input id="confirm-new-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" required />
          </div>
          <button type="submit" disabled={isChangingPwd} className="btn-primary w-full sm:w-auto px-6" id="change-password-btn">
            {isChangingPwd ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
