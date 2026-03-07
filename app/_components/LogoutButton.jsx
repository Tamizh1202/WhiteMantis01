"use client";
import React from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axiosClient from '@/lib/axios';

export default function LogoutButtonClient() {
  const router = useRouter();

  async function handleLogout() {
    try {
      localStorage.clear();
      sessionStorage.clear();

      await axiosClient.get('/api/logout');
      await signOut({ redirect: false });

      // 4. Final Redirect
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error('Logout failed', e);
    }
  }

  return (
    <button onClick={handleLogout} style={{ marginLeft: 8 }}>Logout</button>
  );
}
