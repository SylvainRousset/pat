'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart, CartItem } from '@/context/CartContext';

// Données fictives pour les produits en vedette
const featuredProducts = [
  {
    id: 1,
    name: 'La Boîte à Choux',
    description: 'Une sélection raffinée de choux gourmands aux saveurs printanières.',
    price: '18 €',
    image: '/images/laboite-a-choux.avif',
    slug: '/boutique/boite-a-choux',
  },
  {
    id: 2,
    name: 'La Boîte à Flower Cake',
    description: 'Des créations florales délicates pour célébrer le printemps.',
    price: '24 €',
    image: '/images/laboite-a-flowercake.avif',
    slug: '/boutique/boite-a-flowercake',
  },
  {
    id: 3,
    name: 'La Boîte Revisitée',
    description: 'Nos classiques réinventés avec une touche de modernité.',
    price: '20 €',
    image: '/images/la-boite-arevisite.avif',
    slug: '/boutique/boite-revisite',
  },
];

const FeaturedProducts = () => {
  const { addToCart } = useCart();
  const [notifications, setNotifications] = useState<{id: number, productId: number}[]>([]);

  const handleAddToCart = (product: Omit<CartItem, 'quantity'>) => {
    // Ajouter au panier et ouvrir le panier
    addToCart(product, true);
    
    // Créer une notification
    const notificationId = Date.now();
    setNotifications(prev => [...prev, { id: notificationId, productId: product.id }]);
    
    // Supprimer la notification après 2 secondes
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }, 2000);
  };

  return (
    <section className="py-6 md:py-16 bg-white w-full overflow-hidden">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-6 md:mb-12 px-4 sm:px-0">
          <h2 className="text-xl md:text-4xl font-bold mb-2 md:mb-4">Nos Créations du Mois de Mars</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Découvrez nos pâtisseries les plus appréciées, préparées chaque jour avec passion et des ingrédients de saison.
          </p>
        </div>

        {/* Carte des saveurs d'hiver */}
        <div className="max-w-3xl mx-auto mb-6 md:mb-10 px-4 sm:px-0">
          <div className="bg-[#f8f5f0] rounded-lg shadow-md p-3 md:p-5">
            <h3 className="text-lg md:text-xl font-bold text-center text-gray-900 mb-1 md:mb-2">Carte des Saveurs Hiver</h3>
            <p className="text-xs md:text-sm text-center text-amber-700 mb-2 md:mb-4">Janvier - Mars</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 max-w-2xl mx-auto">
              <div className="flex items-center">
                <span className="w-2 md:w-2.5 h-2 md:h-2.5 bg-amber-600 rounded-full mr-2"></span>
                <span className="font-medium text-sm md:text-base">Chocolat Passions</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 md:w-2.5 h-2 md:h-2.5 bg-amber-600 rounded-full mr-2"></span>
                <span className="font-medium text-sm md:text-base">Noisette Vanille Popcorn</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 md:w-2.5 h-2 md:h-2.5 bg-amber-600 rounded-full mr-2"></span>
                <span className="font-medium text-sm md:text-base">Caramel Fleur de Sel Kalamansi</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 md:w-2.5 h-2 md:h-2.5 bg-amber-600 rounded-full mr-2"></span>
                <span className="font-medium text-sm md:text-base">Matcha Sésame Noir Noix de Coco Mangue Combava</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 px-4 sm:px-0">
          {featuredProducts.map((product, index) => (
            <div key={product.id} className="bg-white overflow-hidden transition-transform hover:scale-105 max-w-sm mx-auto w-full relative shadow-sm rounded-lg">
              {/* Notification d'ajout au panier */}
              {notifications.some(n => n.productId === product.id) && (
                <div className="absolute top-2 right-2 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs animate-bounce">
                  Ajouté !
                </div>
              )}
              
              <div className="relative aspect-[4/3] overflow-hidden rounded-md mb-4">
                <Link href={`/produit/${product.id}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 640px) 80vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 25vw"
                    quality={90}
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </Link>
              </div>
              <div className="p-2 md:p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <span className="text-amber-600 font-semibold">{product.price}</span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-2 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Ajouter
                  </button>
                  <Link 
                    href={`/produit/${product.id}`}
                    className="text-amber-600 hover:text-amber-800 font-medium text-sm transition-colors"
                  >
                    Détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 md:mt-12">
          <Link
            href="/boutique"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 md:py-3 px-5 md:px-8 rounded-full transition-colors text-sm md:text-base"
          >
            Voir tous nos produits
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 