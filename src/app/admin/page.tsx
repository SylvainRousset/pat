'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AdminLogin() {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers le tableau de bord sans vérification
    router.push('/admin/dashboard');
  }, [router]);

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
              Redirection vers le tableau de bord...
            </p>
            <div className="mt-6">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 