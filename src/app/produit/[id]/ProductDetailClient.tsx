'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProductById } from '@/lib/firebaseAdmin';
import { Product } from '@/lib/firebaseAdmin';

export default function ProductDetailClient({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  // Chargement du produit
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(params.id);
        
        if (!productData) {
          setError('Produit non trouvé');
          return;
        }
        
        setProduct(productData);
      } catch (err) {
        console.error('Erreur lors du chargement du produit:', err);
        setError('Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [params.id]);

  // Réinitialiser le message après 2 secondes
  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [addedToCart]);

  const handleAddToCart = () => {
    if (!product || isAdding) return;
    
    setIsAdding(true);
    
    // Préparation des données pour le panier
    addToCart({
      id: parseInt(product.id),
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 
        ? product.images[0] 
        : (product.image || '/images/placeholder.jpg'),
      slug: product.name.toLowerCase().replace(/\s+/g, '-')
    });
    
    // Afficher le message de confirmation
    setAddedToCart(true);
    
    // Réactiver le bouton après un court délai
    setTimeout(() => {
      setIsAdding(false);
    }, 300);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#f8f5f0] py-12">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
            <p className="ml-4 text-amber-600">Chargement du produit...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#f8f5f0] py-12">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
              <p className="text-gray-700 mb-6">{error || 'Produit non disponible'}</p>
              <Link href="/boutique" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-md inline-block">
                Retour à la boutique
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Préparation des données
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];
  
  const productDescription = product.descriptionArray && product.descriptionArray.length > 0
    ? product.descriptionArray
    : [product.description];

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
                  {productImages.length > 0 ? (
                    <Image
                      src={productImages[selectedImage]}
                      alt={product.name}
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
                {productImages.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {productImages.map((image, index) => (
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
                  {productDescription.map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              
              {/* Colonne droite - Informations produit */}
              <div className="space-y-6">
                <div className="mt-4 flex justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                  <p className="text-lg font-medium text-gray-900">{Number(product.price).toFixed(2)} €</p>
                </div>
                
                {product.portions && (
                  <p className="text-lg text-gray-600 mt-1">en portions de {product.portions}</p>
                )}
                
                {product.address && (
                  <div className="py-3 border-t border-b border-gray-200">
                    <p className="flex items-start">
                      <svg className="w-5 h-5 mr-2 mt-0.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{product.address}</span>
                    </p>
                  </div>
                )}
                
                <div className="pt-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`w-full ${isAdding ? 'bg-amber-400' : 'bg-amber-600 hover:bg-amber-700'} text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {addedToCart ? 'Ajouté !' : 'Ajouter au panier'}
                  </button>
                </div>
                
                {product.notice && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-md border border-amber-100">
                    <div className="flex items-center text-amber-700 font-medium">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {product.notice}
                    </div>
                  </div>
                )}
                
                {product.allergens && product.allergens.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Allergènes</h2>
                    <p className="text-gray-700 mb-4">
                      Il est essentiel de prendre en compte les allergènes lors de la consommation alimentaire.
                    </p>
                    <p className="text-gray-700 mb-4">
                      Certains des allergènes connus incluent :
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      {product.allergens.map((allergen, index) => (
                        <li key={index} className="flex items-start">
                          <span>{allergen}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-gray-700 mt-4">
                      La sensibilisation aux allergènes alimentaires est cruciale pour assurer la sécurité de tous, en particulier des personnes souffrant d&apos;allergies sévères.
                    </p>
                    <p className="text-gray-700 mt-4">
                      En intégrant ces précautions dans la présentation des aliments, je favorise un environnement alimentaire plus sûr et inclusif.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 