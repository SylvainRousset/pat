'use client';

import Image from 'next/image';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Creations() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    "/images/creation1.avif",
    "/images/creation2.avif",
    "/images/creation3.avif",
    "/images/creation4.avif"
  ];

  return (
    <>
      <Navbar />
      <main className="bg-[#f8f5f0] py-6">
        <div className="container mx-auto px-4">
          <section>
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">Mes Créations</h1>
            
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="prose max-w-none text-center">
                <p className="text-lg">
                  Découvrez mes créations sucrées pour tous vos événements spéciaux.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {images.map((image, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative h-[300px]">
                    <Image
                      src={image}
                      alt={`Création ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Modal pour l'image agrandie */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={selectedImage}
              alt="Image agrandie"
              fill
              className="object-contain"
              sizes="80vw"
              priority
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
} 