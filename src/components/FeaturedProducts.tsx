'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

// Type pour les produits à afficher
interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les produits au chargement du composant
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Récupérer uniquement les produits à afficher sur la page d'accueil
        const response = await fetch('/api/products?showOnHome=true');
        
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

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">Nos Saveurs du Moment</h2>
        
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des produits...</p>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [notifications, setNotifications] = useState<{id: number, productId: number}[]>([]);

  const handleAddToCart = (product: Product) => {
    // Ajouter au panier et ouvrir le panier
    addToCart({
      id: parseInt(product.id),
      name: product.name,
      price: product.price,
      image: product.image,
      slug: product.name.toLowerCase().replace(/\s+/g, '-')
    }, true);
    
    // Créer une notification
    const notificationId = Date.now();
    setNotifications(prev => [...prev, { id: notificationId, productId: parseInt(product.id) }]);
    
    // Supprimer la notification après 2 secondes
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }, 2000);
  };

  return (
    <div className="bg-white overflow-hidden transition-transform hover:scale-105 max-w-sm mx-auto w-full relative shadow-sm rounded-lg">
      {/* Notification d'ajout au panier */}
      {notifications.some(n => n.productId === parseInt(product.id)) && (
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
            priority={true}
            loading="eager"
          />
        </Link>
      </div>
      <div className="p-2 md:p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
          <span className="text-amber-600 font-semibold">{Number(product.price).toFixed(2)} €</span>
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
  );
};

export default FeaturedProducts; 