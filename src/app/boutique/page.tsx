'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Données des produits
const products = [
  {
    id: 1,
    name: 'La Boîte à Choux',
    price: '18 €',
    image: '/images/laboite-a-choux.avif',
    description: 'Une sélection raffinée de choux gourmands aux saveurs printanières.'
  },
  {
    id: 2,
    name: 'La Boîte à Flowercake',
    price: '24 €',
    image: '/images/laboite-a-flowercake.avif',
    description: 'Des créations florales délicates pour célébrer le printemps.'
  },
  {
    id: 3,
    name: 'La Boîte Revisitée',
    price: '20 €',
    image: '/images/la-boite-arevisite.avif',
    description: 'Nos classiques réinventés avec une touche de modernité.'
  }
];

export default function BoutiquePage() {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    
    // Afficher la notification
    setAddedToCart(prev => ({ ...prev, [product.id.toString()]: true }));
    
    // Masquer la notification après 2 secondes
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id.toString()]: false }));
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8f5f0]">
        <div className="py-16 bg-amber-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Notre Boutique</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Découvrez notre sélection de pâtisseries artisanales préparées avec passion.
            </p>
          </div>
        </div>
        
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                  {/* Notification d'ajout au panier */}
                  {addedToCart[product.id.toString()] && (
                    <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-sm py-1 px-3 rounded-full animate-bounce">
                      Ajouté au panier!
                    </div>
                  )}
                  
                  <Link href={`/produit/${product.id}`} className="block relative aspect-[4/3] w-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </Link>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
                      <span className="text-amber-600 font-semibold">{product.price}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <Link 
                        href={`/produit/${product.id}`}
                        className="text-amber-600 hover:text-amber-800 font-medium"
                      >
                        Détails
                      </Link>
                      
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 