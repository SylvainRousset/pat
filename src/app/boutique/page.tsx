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
    id: '1',
    name: 'La Boîte à Choux',
    price: '18 €',
    image: '/images/laboite-a-choux.avif',
    description: 'Une sélection raffinée de choux gourmands aux saveurs printanières.'
  },
  {
    id: '2',
    name: 'La Boîte à Flowercake',
    price: '24 €',
    image: '/images/laboite-a-flowercake.avif',
    description: 'Des créations florales délicates pour célébrer le printemps.'
  },
  {
    id: '3',
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
      id: parseInt(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.name.toLowerCase().replace(/\s+/g, '-')
    });
    
    // Afficher la notification
    setAddedToCart(prev => ({ ...prev, [product.id]: true }));
    
    // Réinitialiser après 2 secondes
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8f5f0] py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Les Saveurs de Saison</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-amber-700 mb-4 text-center">Carte des Saveurs Hiver</h2>
            <p className="text-lg mb-6 text-center">Janvier - Mars</p>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-center">Nos saveurs de saison :</h3>
              <ul className="space-y-3 max-w-xl mx-auto">
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-amber-600 rounded-full mr-2"></span>
                  <span className="font-medium">Chocolat Passions</span>
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-amber-600 rounded-full mr-2"></span>
                  <span className="font-medium">Noisette Vanille Popcorn</span>
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-amber-600 rounded-full mr-2"></span>
                  <span className="font-medium">Caramel Fleur de Sel Kalamansi</span>
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 bg-amber-600 rounded-full mr-2"></span>
                  <span className="font-medium">Matcha Sésame Noir Noix de Coco Mangue Combava</span>
                </li>
              </ul>
            </div>
            
            <p className="text-gray-700 mb-6 text-center">
              La Carte des Saisons évolue tout au long de l&apos;année pour célébrer les saveurs de chaque saison : printemps, été, automne, hiver.
            </p>
            
            <p className="text-gray-700 mb-6 text-center">
              Chaque saison, découvrez 4 saveurs uniques déclinées dans 3 créations pâtissières : une boîte à choux, une boîte à macarons, une boîte à flower cakes.
            </p>
            
            <p className="text-gray-700 mb-6 text-center">
              Chaque boîte contient les 4 saveurs de la saison, les compositions des boîtes sont fixes et ne peuvent pas être modifiées ni divisées.
            </p>
            
            <p className="text-lg font-semibold text-amber-600 italic text-center">
              Une invitation gourmande à savourer les saisons, sans compromis !
            </p>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Nos Boîtes Gourmandes</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                {/* Notification d'ajout au panier */}
                {addedToCart[product.id] && (
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
      </main>
      <Footer />
    </>
  );
} 