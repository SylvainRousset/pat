'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

// Type pour les produits
interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
}

// Catégories disponibles
const categories = [
  { id: 'tous', name: 'Tous les produits' },
  { id: 'boites', name: 'Boîtes de Saison' },
  { id: 'cookies', name: 'Cookies' },
  { id: 'creation', name: 'Boîte à Création' },
  { id: 'gateaux', name: 'Gâteaux à Partager' },
  { id: 'surmesure', name: 'Sur Mesure' },
];

export default function BoutiquePage() {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('tous');

  // Charger les produits au chargement de la page
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Récupérer TOUS les produits
        const response = await fetch('/api/products');
        
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

  // Filtrer les produits par catégorie
  const getFilteredProducts = () => {
    if (selectedCategory === 'tous') {
      return products;
    }
    
    return products.filter(product => {
      const name = product.name.toLowerCase();
      const description = product.description.toLowerCase();
      
      switch (selectedCategory) {
        case 'boites':
          return name.includes('boîte à choux') || name.includes('boîte à macarons') || 
                 name.includes('boîte à flowercakes') || name.includes('flower cake') ||
                 name.includes('choux') || name.includes('macaron');
        case 'cookies':
          return name.includes('cookie') || name.includes('chouquette');
        case 'creation':
          return name.includes('boîte à création') || name.includes('revisite') ||
                 description.includes('création du mois');
        case 'gateaux':
          return name.includes('tarte') || name.includes('entremet') || 
                 name.includes('pavlova') || name.includes('paris-brest') ||
                 name.includes('charlotte');
        case 'surmesure':
          return name.includes('sur mesure') || name.includes('personnalisé') ||
                 description.includes('sur mesure') || description.includes('personnalisé');
        default:
          return true;
      }
    });
  };

  const filteredProducts = getFilteredProducts();

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
          <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-6 md:mb-8">La Boutique Coquelicot</h1>
          
          {/* Filtres par catégorie */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-[#a75120] text-white shadow-lg transform scale-105'
                      : 'bg-white text-[#421500] hover:bg-[#f1e9dc] shadow-md hover:shadow-lg'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Compteur de produits */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm md:text-base">
              {filteredProducts.length} {filteredProducts.length > 1 ? 'produits' : 'produit'} {selectedCategory !== 'tous' ? `dans cette catégorie` : 'au total'}
            </p>
          </div>
          
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
              {filteredProducts.map((product) => (
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
          
          {!isLoading && !error && filteredProducts.length === 0 && products.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucun produit dans cette catégorie pour le moment.
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
      <ScrollToTop />
    </>
  );
} 