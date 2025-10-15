'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

interface Product {
  id: string;
  name: string;
  image: string;
  description?: string;
  showInCreations?: boolean;
}

export default function Creations() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [creations, setCreations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les produits depuis Firebase
  useEffect(() => {
    const fetchCreations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        
        const data = await response.json();
        
        // Filtrer uniquement les produits à afficher dans créations
        const creationsProducts = data.filter((product: Product) => 
          product.showInCreations !== false
        );
        
        setCreations(creationsProducts);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCreations();
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-[#f1e9dc] py-8 md:py-12 min-h-screen">
        <div className="container mx-auto px-4 max-w-7xl">
          <section>
            <h1 className="text-3xl md:text-5xl font-bold text-center text-[#421500] mb-8 md:mb-12">Mes Créations</h1>
            
            <div className="bg-[#f8f3eb] rounded-xl shadow-lg p-6 md:p-10 mb-12 border-2 border-[#a75120]/20">
              <p className="text-base md:text-lg text-[#421500]/85 text-center leading-relaxed">
                Découvrez mes <span className="font-semibold text-[#a75120]">créations sucrées</span> pour tous vos événements spéciaux.
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a75120] mx-auto"></div>
                <p className="mt-4 text-[#421500]/80">Chargement des créations...</p>
              </div>
            ) : creations.length === 0 ? (
              <div className="text-center py-12 text-[#421500]/70">
                Aucune création à afficher pour le moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8 mb-6">
                {creations.map((creation, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-[#a75120]/30"
                  onClick={() => setSelectedImage(creation.image)}
                >
                  <div className="relative w-[200px] h-[200px] sm:w-[220px] sm:h-[220px] lg:w-[240px] lg:h-[240px] xl:w-[260px] xl:h-[260px] 2xl:w-[280px] 2xl:h-[280px] overflow-hidden mx-auto">
                    <Image
                      src={creation.image}
                      alt={creation.name}
                      width={280}
                      height={280}
                      className="object-cover w-full h-full"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#421500] text-center">{creation.name}</h3>
                  </div>
                </div>
              ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal pour l'image agrandie */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-6xl h-[90vh]">
            <button
              className="absolute top-4 right-4 z-10 bg-[#a75120] hover:bg-[#8a421a] text-white p-3 rounded-full shadow-lg transition-colors"
              onClick={() => setSelectedImage(null)}
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Image agrandie"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ScrollToTop />
    </>
  );
}