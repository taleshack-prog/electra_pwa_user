'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Root() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('electra_token');
    router.replace(token ? '/home' : '/login');
  }, [router]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#070B14' }}>
      <div style={{ fontSize: 48 }}>⚡</div>
    </div>
  );
}
