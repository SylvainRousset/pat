'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FaCheckCircle } from 'react-icons/fa';

export default function ConfirmationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8f5f0] py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <FaCheckCircle className="text-green-500 text-6xl" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Commande confirmée !</h1>
              <p className="text-lg text-gray-600">
                Merci pour votre commande. Votre demande a été enregistrée avec succès.
              </p>
              <p className="text-lg text-gray-600 mt-2">
                Un e-mail de confirmation a été envoyé à votre adresse.
              </p>
            </div>
            
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-amber-800 mb-4">Informations importantes</h2>
              <ul className="space-y-3 text-amber-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Votre commande sera disponible à la date et à l&apos;heure que vous avez sélectionnées.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Veuillez vous présenter à l&apos;adresse suivante : <strong>3 rue des prés du roi 64800 NAY</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>N&apos;oubliez pas d&apos;apporter une preuve de votre commande (email de confirmation ou numéro de commande).</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Le paiement s&apos;effectuera sur place lors du retrait de votre commande.</span>
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Si vous avez des questions concernant votre commande, n&apos;hésitez pas à me contacter.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/boutique" 
                  className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
                >
                  Retour à la boutique
                </Link>
                <Link 
                  href="/contact" 
                  className="inline-block bg-white border border-amber-600 hover:bg-amber-50 text-amber-600 font-medium py-3 px-6 rounded-md transition-colors"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 