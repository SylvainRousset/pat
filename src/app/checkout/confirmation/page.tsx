'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const ConfirmationPage = () => {
  const router = useRouter();

  // Rediriger vers la page d'accueil si l'utilisateur accède directement à cette page
  useEffect(() => {
    const timer = setTimeout(() => {
      // Vérifier si le panier est vide dans le localStorage
      const cart = localStorage.getItem('cart');
      if (cart && JSON.parse(cart).length > 0) {
        // Si le panier n'est pas vide, l'utilisateur a probablement accédé directement à cette page
        router.push('/');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Commande confirmée !</h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Merci pour votre commande. Nous vous attendons en boutique à la date choisie.
            </p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-8">
              <h2 className="text-lg font-medium text-amber-800 mb-2">Informations importantes</h2>
              <ul className="text-sm text-amber-700 list-disc list-inside space-y-1">
                <li>Votre commande sera préparée fraîchement pour le jour de retrait choisi</li>
                <li>Merci de vous présenter avec une pièce d'identité</li>
                <li>Le paiement s'effectue sur place (CB, espèces)</li>
                <li>Nous vous avons envoyé un récapitulatif par email</li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Retour à l'accueil
              </Link>
              
              <Link
                href="/boutique"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Découvrir d'autres produits
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ConfirmationPage; 