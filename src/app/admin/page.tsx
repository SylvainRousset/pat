'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Définir un type pour l'erreur Firebase
interface FirebaseError {
  code: string;
  message: string;
}

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // Connexion avec Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      
      // Stocker l'état d'authentification dans localStorage
      localStorage.setItem('adminAuthenticated', 'true');
      
      // Rediriger vers le tableau de bord
      router.push('/admin/dashboard');
    } catch (err: unknown) {
      const firebaseError = err as FirebaseError;
      console.error('Erreur de connexion:', firebaseError);
      
      // Gérer les erreurs d'authentification
      if (firebaseError.code === 'auth/invalid-credential') {
        setError('Email ou mot de passe incorrect');
      } else if (firebaseError.code === 'auth/too-many-requests') {
        setError('Trop de tentatives infructueuses. Veuillez réessayer plus tard.');
      } else {
        setError('Une erreur est survenue lors de la connexion');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f8f5f0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Image
              src="/images/logo.png"
              alt="Logo Pâtisserie"
              width={120}
              height={120}
              className="mx-auto"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Administration
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Connectez-vous pour accéder au tableau de bord
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isLoading ? 'bg-amber-400' : 'bg-amber-600 hover:bg-amber-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
                >
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 