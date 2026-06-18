import React, { useState } from 'react';
import { PageContainer, TextField, SubmitButton } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { userApi } from '../../api/user';
import AccountNav from './AccountNav';
import SEOHead from '../../components/SEOHead';
import type { ApiErrorShape } from '../../api/client';

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { user: updated } = await userApi.updateProfile({ name, phone });
      setUser(updated);
      toast.success('Profile updated');
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setSavingPassword(true);
    try {
      await userApi.changePassword({ currentPassword, newPassword });
      toast.success('Password changed');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <PageContainer>
      <SEOHead title="My Profile" noindex />
      <h1 className="font-display text-3xl font-bold tracking-tight text-brand-blue md:text-4xl">My Account</h1>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <AccountNav />
        </div>
        <div className="space-y-8 lg:col-span-3">
          <section className="rounded-2xl border border-brand-blue/10 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-brand-blue">Personal Details</h2>
            <form onSubmit={saveProfile} className="mt-4 max-w-md">
              <TextField id="name" label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <TextField id="email" label="Email" value={user?.email || ''} disabled />
              <TextField id="phone" label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <SubmitButton type="submit" loading={savingProfile} className="mt-2">
                Save Changes
              </SubmitButton>
            </form>
          </section>

          <section className="rounded-2xl border border-brand-blue/10 bg-white p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-brand-blue">Change Password</h2>
            <form onSubmit={savePassword} className="mt-4 max-w-md">
              <TextField
                id="currentPassword"
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
              <TextField
                id="newPassword"
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
              <SubmitButton type="submit" loading={savingPassword} className="mt-2">
                Update Password
              </SubmitButton>
            </form>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
