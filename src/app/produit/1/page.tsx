'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Données du produit "La Boîte à Choux"
const productData = {
  id: '1',
  name: 'La Boîte à Choux',
  price: '18 €',
  portions: '12 mignardises',
  address: '3 rue des prés du roi 64800 NAY',
  images: [
    '/images/laboite-a-choux.avif',
    '/images/product2.jpg',
    '/images/product3.jpg',
    '/images/product4.jpg',
  ],
  description: [
    'Découvrez la sélection de petits choux, déclinés en 4 délicieuses saveurs de saison en format de 12 pièces. Carte des saveurs.',
    'Que ce soit pour un goûter gourmand ou pour égayer vos événements, mes choux sont préparés avec soin.',
    'Je m\'engage à utiliser des produits frais, de hautes qualités, confectionnés le jour même, afin de garantir une expérience de dégustation exceptionnelle.',
    'Nе manquez pas l\'occasion de savourer ces créations uniques.',
    'Il est important de noter que les compositions des boîtes sont fixes et qu\'il n\'est pas possible de les modifier selon vos préférences. Profitez pleinement de cette expérience gourmande tout en respectant la diversité savoureuse que chaque boîte offre.'
  ],
  allergens: [
    '🌰 les fruits à coque',
    '🥛 le lactose',
    '🌾 le gluten',
    '🥚 l\'œuf',
    '🌱 le sésame'
  ],
  notice: 'Commandez 48h à l\'avance'
};

export default function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: productData.id,
      name: productData.name,
      price: productData.price,
      image: productData.images[0] || '/images/placeholder.jpg',
      quantity: 1
    });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8f5f0] py-12">
        <div className="container mx-auto px-4">
          <Link href="/boutique" className="inline-flex items-center text-amber-700 hover:text-amber-900 mb-8">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à la boutique
          </Link>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Colonne gauche - Images */}
              <div className="space-y-6">
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden border border-gray-200">
                  {productData.images.length > 0 ? (
                    <Image
                      src={productData.images[selectedImage]}
                      alt={productData.name}
                      fill
                      className="object-cover"
                      quality={90}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-lg">Image non disponible</span>
                    </div>
                  )}
                </div>
                
                {/* Miniatures */}
                {productData.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {productData.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative h-20 rounded-md overflow-hidden border-2 transition-all ${
                          selectedImage === index ? 'border-amber-500 shadow-md' : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Miniature ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Description sous les images */}
                <div className="mt-8 space-y-4 text-gray-700">
                  {productData.description.map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              
              {/* Colonne droite - Informations produit */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{productData.name}</h1>
                  <p className="text-lg text-gray-600 mt-1">en portions de {productData.portions}</p>
                  <p className="text-2xl font-bold text-amber-600 mt-4">{productData.price}</p>
                </div>
                
                <div className="py-3 border-t border-b border-gray-200">
                  <p className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{productData.address}</span>
                  </p>
                </div>
                
                <div className="pt-4">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Ajouter au panier
                  </button>
                </div>
                
                <div className="mt-4 p-4 bg-amber-50 rounded-md border border-amber-100">
                  <div className="flex items-center text-amber-700 font-medium">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {productData.notice}
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Allergènes</h2>
                  <p className="text-gray-700 mb-4">
                    Il est essentiel de prendre en compte les allergènes lors de la consommation alimentaire.
                  </p>
                  <p className="text-gray-700 mb-4">
                    Certains des allergènes connus incluent :
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    {productData.allergens.map((allergen, index) => (
                      <li key={index} className="flex items-start">
                        <span>{allergen}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-700 mt-4">
                    La sensibilisation aux allergènes alimentaires est cruciale pour assurer la sécurité de tous, en particulier des personnes souffrant d'allergies sévères.
                  </p>
                  <p className="text-gray-700 mt-4">
                    En intégrant ces précautions dans la présentation des aliments, je favorise un environnement alimentaire plus sûr et inclusif.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 