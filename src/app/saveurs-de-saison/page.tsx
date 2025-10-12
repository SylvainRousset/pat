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

export default function SaveursDeSaison() {
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
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        
        const data = await response.json();
        
        // Filtrer les produits des saveurs de saison
        const seasonProducts = data.filter((product: Product) => {
          const name = product.name.toLowerCase();
          return name.includes('boîte à choux') || name.includes('boîte à macarons') || 
                 name.includes('boîte à flowercakes') || name.includes('flower cake') ||
                 name.includes('boîte à pavlova') || name.includes('boîte à tartelette');
        });
        
        setProducts(seasonProducts);
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
      <main className="min-h-screen bg-[#f1e9dc] py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Titre principal */}
          <h1 className="text-3xl md:text-5xl font-bold text-center text-[#421500] mb-8 md:mb-12">
            Les Saveurs de Saison
          </h1>
          
          {/* Texte de présentation */}
          <div className="bg-[#f8f3eb] rounded-xl shadow-lg p-6 md:p-10 mb-12 border-2 border-[#a75120]/20">
            <p className="text-base md:text-lg text-[#421500]/85 text-center leading-relaxed">
              Je vous invite à découvrir ma <span className="font-semibold text-[#a75120]">carte des saveurs</span>, qui se renouvellera chaque saison avec <span className="font-semibold text-[#a75120]">quatre parfums uniques</span>. 
              Chacun d&apos;eux a été minutieusement élaboré à partir de <span className="font-semibold text-[#a75120]">produits locaux et de haute qualité</span>, 
              soigneusement sélectionnés pour garantir une <span className="font-semibold text-[#a75120]">expérience gustative inégalée</span>.
            </p>
          </div>

          {/* Section Les racines du concept */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#421500] mb-8">
              Les racines du concept
            </h2>
            
            <div className="bg-[#f8f3eb] rounded-xl shadow-xl p-6 md:p-10 border-2 border-[#a75120]/20">
              <h3 className="text-xl md:text-2xl font-semibold text-[#a75120] mb-6 text-center">
                Comment ça marche ?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Image à gauche */}
                <div className="order-2 md:order-1">
                  <div className="relative h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-xl bg-[#f8f3eb]">
                    <Image
                      src="/images/saveursaisoncartel.avif"
                      alt="Saveurs de saison"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* Texte à droite */}
                <div className="order-1 md:order-2 space-y-5 text-[#421500]/90">
                  <p className="text-base md:text-lg leading-relaxed">
                    La Carte des Saisons évolue tout au long de l&apos;année pour célébrer les saveurs de chaque saison : 
                    <span className="font-semibold text-[#a75120]"> printemps, été, automne, hiver</span>.
                  </p>

                  <p className="text-base md:text-lg leading-relaxed">
                    Chaque saison, découvrez <span className="font-semibold text-[#a75120]">4 saveurs uniques</span> déclinées dans plusieurs créations pâtissières : 
                    une boîte à choux, une boîte à macarons, une boîte à flower cakes, la boîte à pavlovas et la boîte à tartelettes.
                  </p>

                  <p className="text-base md:text-lg leading-relaxed">
                    Chaque boîte contient les <span className="font-semibold text-[#a75120]">4 saveurs de la saison</span>, 
                    les compositions des boîtes sont fixes et ne peuvent pas être modifiées ni divisées.
                  </p>

                  <p className="text-lg md:text-xl font-semibold text-[#a75120] italic text-center mt-6 pt-6 border-t-2 border-[#a75120]/30">
                    Une invitation gourmande à savourer les saisons, sans compromis !
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section des produits */}
          <div className="bg-[#F7F5EF] rounded-xl shadow-xl p-6 md:p-10 border-2 border-[#a75120]/20">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#421500] mb-8">
              Nos Créations de Saison
            </h2>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a75120] mx-auto"></div>
                <p className="mt-4 text-[#421500]/80">Chargement des produits...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-lg mx-auto">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-[#a75120]/30">
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
                    
                    <div className="p-4 md:p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg md:text-xl font-bold text-[#421500]">{product.name}</h3>
                        <span className="text-[#a75120] font-semibold text-lg">{Number(product.price).toFixed(2)} €</span>
                      </div>
                      
                      <p className="text-[#421500]/75 text-sm md:text-base mb-4">{product.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <Link 
                          href={`/produit/${product.id}`}
                          className="text-[#a75120] hover:text-[#8a421a] font-medium text-sm md:text-base underline"
                        >
                          Détails
                        </Link>
                        
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-[#a75120] hover:bg-[#8a421a] text-white text-xs md:text-sm px-3 md:px-4 py-2 rounded-md transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
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
              <div className="text-center py-8 text-[#421500]/70 bg-white rounded-lg shadow-md p-8">
                Aucun produit de saison disponible pour le moment.
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
} 