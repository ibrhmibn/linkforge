'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import HUDBar from '@/components/HUDBar';
import ArcadeButton from '@/components/ArcadeButton';
import ArcadeCard from '@/components/ArcadeCard';
import { ArrowLeft, LogIn, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle antara Login / Register
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        // Proses Login
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        // Proses Register
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Cek email lu buat verifikasi ya (kalo di settingan Supabase lu nyala)!');
      }
      router.push('/dashboard'); // Kalo sukses, lempar ke Dashboard
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-grid-perspective min-h-screen text-white flex flex-col items-center">
      <HUDBar score={0} hiScore={0} credits={1} />
      
      <div className="w-full max-w-md px-4 mt-20">
        <Link href="/" className="inline-block mb-8">
          <ArcadeButton variant="dark" className="!px-4 !py-2">
            <ArrowLeft size={16} className="inline mr-2" /> Back to Home
          </ArcadeButton>
        </Link>

        <ArcadeCard title={isLogin ? "Player Login" : "New Player"} accent="yellow">
          <form onSubmit={handleAuth} className="space-y-6">
            
            {errorMsg && (
              <div className="border-2 border-arcade-red bg-arcade-red/20 p-3 text-arcade-red text-sm font-bold">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block font-pixel text-xs mb-2">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="w-full bg-arcade-bg border-4 border-white p-3 text-white focus:outline-none focus:border-arcade-yellow" 
                placeholder="player@arcade.com"
              />
            </div>

            <div>
              <label className="block font-pixel text-xs mb-2">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="w-full bg-arcade-bg border-4 border-white p-3 text-white focus:outline-none focus:border-arcade-yellow" 
                placeholder="********"
              />
            </div>

            <ArcadeButton 
              variant={isLogin ? "red" : "yellow"} 
              type="submit" 
              className="w-full justify-center"
              disabled={loading}
            >
              {loading ? 'LOADING...' : isLogin ? <><LogIn size={18} className="mr-2"/> START GAME</> : <><UserPlus size={18} className="mr-2"/> CREATE ACCOUNT</>}
            </ArcadeButton>
          </form>

          <div className="mt-6 text-center border-t-2 border-white/20 pt-4">
            <button 
              onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); }} 
              className="font-pixel text-xs text-arcade-yellow hover:text-white transition-colors"
            >
              {isLogin ? 'Belum punya akun? Register!' : 'Udah punya akun? Login!'}
            </button>
          </div>
        </ArcadeCard>
      </div>
    </main>
  );
}