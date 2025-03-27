'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Type pour les produits
interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
}

export default function BoutiquePage() {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les produits au chargement de la page
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Récupérer uniquement les produits à afficher dans la boutique
        const response = await fetch('/api/products?showInShop=true');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError('Impossible de charger les produits. Veuillez réessayer plus tard.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
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
      <main className="min-h-screen bg-[#f8f5f0] py-6 md:py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-4 md:mb-8">Les Saveurs de Saison</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 mb-8 md:mb-12 max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-amber-700 mb-2 md:mb-4 text-center">Carte des Saveurs Hiver</h2>
            <p className="text-base md:text-lg mb-4 md:mb-6 text-center">Janvier - Mars</p>
            
            <div className="mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 text-center">Nos saveurs de saison :</h3>
              <ul className="space-y-2 md:space-y-3 max-w-xl mx-auto">
                <li className="flex items-center">
                  <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-amber-600 rounded-full mr-2"></span>
                  <span className="font-medium text-sm md:text-base">Chocolat Passions</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-amber-600 rounded-full mr-2"></span>
                  <span className="font-medium text-sm md:text-base">Noisette Vanille Popcorn</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-amber-600 rounded-full mr-2"></span>
                  <span className="font-medium text-sm md:text-base">Caramel Fleur de Sel Kalamansi</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-amber-600 rounded-full mr-2"></span>
                  <span className="font-medium text-sm md:text-base">Matcha Sésame Noir Noix de Coco Mangue Combava</span>
                </li>
              </ul>
            </div>
            
            <p className="text-gray-700 text-sm md:text-base mb-3 md:mb-6 text-center">
              La Carte des Saisons évolue tout au long de l&apos;année pour célébrer les saveurs de chaque saison : printemps, été, automne, hiver.
            </p>
            
            <p className="text-gray-700 text-sm md:text-base mb-3 md:mb-6 text-center">
              Chaque saison, découvrez 4 saveurs uniques déclinées dans 3 créations pâtissières : une boîte à choux, une boîte à macarons, une boîte à flower cakes.
            </p>
            
            <p className="text-gray-700 text-sm md:text-base mb-3 md:mb-6 text-center">
              Chaque boîte contient les 4 saveurs de la saison, les compositions des boîtes sont fixes et ne peuvent pas être modifiées ni divisées.
            </p>
            
            <p className="text-base md:text-lg font-semibold text-amber-600 italic text-center">
              Une invitation gourmande à savourer les saisons, sans compromis !
            </p>
          </div>
          
          <h2 className="text-xl md:text-3xl font-bold text-center text-gray-900 mb-4 md:mb-8">Nos Boîtes Gourmandes</h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-700">Chargement des produits...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-lg mx-auto">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                  {/* Notification d'ajout au panier */}
                  {addedToCart[product.id] && (
                    <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-xs md:text-sm py-1 px-2 md:px-3 rounded-full animate-bounce">
                      Ajouté !
                    </div>
                  )}
                  
                  <Link href={`/produit/${product.id}`} className="block relative aspect-[4/3] w-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
                    />
                  </Link>
                  
                  <div className="p-3 md:p-6">
                    <div className="flex justify-between items-start mb-1 md:mb-2">
                      <h2 className="text-lg md:text-xl font-bold text-gray-900">{product.name}</h2>
                      <span className="text-amber-600 font-semibold">{Number(product.price).toFixed(2)} €</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">{product.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <Link 
                        href={`/produit/${product.id}`}
                        className="text-amber-600 hover:text-amber-800 font-medium text-sm md:text-base"
                      >
                        Détails
                      </Link>
                      
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-amber-600 hover:bg-amber-700 text-white text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-md transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun produit disponible pour le moment.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 