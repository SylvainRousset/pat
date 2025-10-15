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
  flavors?: string[];
  sizes?: { name: string; price: string }[];
}

export default function SaveursDeSaison() {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  
  // États pour la modal de sélection d'options
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<{ name: string; price: string } | null>(null);

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

  const selectFlavor = (flavor: string) => {
    setSelectedFlavors([flavor]); // Une seule saveur à la fois
  };

  const handleAddToCart = (product: Product) => {
    // Si le produit a des options (saveurs ou tailles), ouvrir la modal
    if ((product.flavors && product.flavors.length > 0) || (product.sizes && product.sizes.length > 0)) {
      setSelectedProduct(product);
      setSelectedFlavors([]);
      setSelectedSize(null);
      setIsOptionsModalOpen(true);
      return;
    }
    
    // Sinon ajouter directement au panier
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

  const confirmAddToCart = () => {
    if (!selectedProduct) return;
    
    // Vérifier si une saveur doit être sélectionnée
    if (selectedProduct.flavors && selectedProduct.flavors.length > 0 && selectedFlavors.length === 0) {
      alert('Veuillez sélectionner une saveur');
      return;
    }
    
    // Vérifier si une taille doit être sélectionnée
    if (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    
    // Construire le nom avec les options
    let productName = selectedProduct.name;
    if (selectedSize) {
      productName += ` (${selectedSize.name})`;
    }
    if (selectedFlavors.length > 0) {
      productName += ` - ${selectedFlavors[0]}`;
    }
    
    // Prix final
    const finalPrice = selectedSize ? selectedSize.price : selectedProduct.price;
    
    addToCart({
      id: parseInt(selectedProduct.id),
      name: productName,
      price: finalPrice,
      image: selectedProduct.image,
      slug: selectedProduct.name.toLowerCase().replace(/\s+/g, '-')
    });
    
    // Afficher la notification
    setAddedToCart(prev => ({ ...prev, [selectedProduct.id]: true }));
    
    // Fermer la modal
    setIsOptionsModalOpen(false);
    setSelectedProduct(null);
    setSelectedFlavors([]);
    setSelectedSize(null);
    
    // Réinitialiser après 2 secondes
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [selectedProduct.id]: false }));
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#8B6F47] py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Titre principal */}
          <h1 className="text-3xl md:text-5xl font-bold text-center text-[#FAF0E6] mb-8 md:mb-12">
            Les Saveurs de Saison
          </h1>
          
          {/* Texte de présentation */}
          <div className="bg-[#6B4E31] rounded-xl shadow-lg p-6 md:p-10 mb-12 border-2 border-[#E8A870]/40">
            <p className="text-base md:text-lg text-[#E8DED0] text-center leading-relaxed">
              Je vous invite à découvrir ma <span className="font-semibold text-[#E8A870]">carte des saveurs</span>, qui se renouvellera chaque saison avec <span className="font-semibold text-[#E8A870]">quatre parfums uniques</span>. 
              Chacun d&apos;eux a été minutieusement élaboré à partir de <span className="font-semibold text-[#E8A870]">produits locaux et de haute qualité</span>, 
              soigneusement sélectionnés pour garantir une <span className="font-semibold text-[#E8A870]">expérience gustative inégalée</span>.
            </p>
          </div>

          {/* Section Les racines du concept */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#f1e9dc] mb-8">
              Les racines du concept
            </h2>
            
            <div className="bg-[#6B4E31] rounded-xl shadow-xl p-0 md:p-10 border-2 border-[#E8A870]/40">
              <h3 className="text-xl md:text-2xl font-semibold text-[#E8A870] mb-6 text-center">
                Comment ça marche ?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Image à gauche */}
                <div className="order-2 md:order-1">
                  <div 
                    className="rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-[#E8DED0] p-0 md:p-2"
                    onClick={() => setZoomedImage('/images/saveursaisoncartel.avif')}
                  >
                    <div className="relative h-[380px] md:h-[600px] overflow-hidden">
                      <Image
                        src="/images/saveursaisoncartel.avif"
                        alt="Saveurs de saison"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute top-2 right-2 bg-[#D9844A] text-white p-2 rounded-full shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#D9844A]/90 text-white px-1 py-0.5 rounded-full text-xs md:hidden text-center mt-2 w-fit mx-auto">
                    Cliquez pour agrandir
                  </div>
                </div>

                {/* Texte à droite */}
                <div className="order-1 md:order-2 space-y-5 text-[#E8DED0]">
                  <p className="text-base md:text-lg leading-relaxed">
                    La Carte des Saisons évolue tout au long de l&apos;année pour célébrer les saveurs de chaque saison : 
                    <span className="font-semibold text-[#E8A870]"> printemps, été, automne, hiver</span>.
                  </p>

                  <p className="text-base md:text-lg leading-relaxed">
                    Chaque saison, découvrez <span className="font-semibold text-[#E8A870]">4 saveurs uniques</span> déclinées dans plusieurs créations pâtissières : 
                    une boîte à choux, une boîte à macarons, une boîte à flower cakes, la boîte à pavlovas et la boîte à tartelettes.
                  </p>

                  <p className="text-base md:text-lg leading-relaxed">
                    Chaque boîte contient les <span className="font-semibold text-[#E8A870]">4 saveurs de la saison</span>, 
                    les compositions des boîtes sont fixes et ne peuvent pas être modifiées ni divisées.
                  </p>

                  <p className="text-lg md:text-xl font-semibold text-[#E8A870] italic text-center mt-6 pt-6 border-t-2 border-[#E8A870]/30">
                    Une invitation gourmande à savourer les saisons, sans compromis !
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section des produits */}
          <div className="bg-[#E8DED0] rounded-xl shadow-xl p-6 md:p-10 border-2 border-[#E8A870]/40">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-[#421500] mb-8">
              Nos Créations de Saison
            </h2>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D9844A] mx-auto"></div>
                <p className="mt-4 text-[#421500]">Chargement des produits...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-lg mx-auto">
                {error}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {products.map((product) => (
                  <div key={product.id} className="bg-[#FAF0E6] rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-[#E8A870]/50">
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
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg md:text-xl font-bold text-[#421500]">{product.name}</h3>
                        <span className="text-[#D9844A] font-semibold text-lg">{Number(product.price).toFixed(2)} €</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Link 
                          href={`/produit/${product.id}`}
                          className="text-[#D9844A] hover:text-[#C27340] font-medium text-sm md:text-base underline"
                        >
                          Détails
                        </Link>
                        
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-[#D9844A] hover:bg-[#C27340] text-white text-xs md:text-sm px-3 md:px-4 py-2 rounded-md transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
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
              <div className="text-center py-8 text-[#421500] bg-[#FAF0E6] rounded-lg shadow-md p-8">
                Aucun produit de saison disponible pour le moment.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de sélection d'options */}
      {isOptionsModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[#FAF0E6] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-[#421500]">
                {selectedProduct.name}
              </h3>
              <button
                onClick={() => setIsOptionsModalOpen(false)}
                className="text-[#421500] hover:text-[#D9844A] text-3xl"
              >
                ×
              </button>
            </div>

            {/* Sélection des saveurs */}
            {selectedProduct.flavors && selectedProduct.flavors.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#421500] mb-3">
                  Saveurs disponibles
                </h4>
                <p className="text-sm text-gray-600 mb-3">Choisissez UNE saveur :</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedProduct.flavors.map((flavor) => (
                    <label
                      key={flavor}
                      className={`flex items-center p-3 border-2 rounded-md cursor-pointer transition-all ${
                        selectedFlavors.includes(flavor)
                          ? 'border-[#D9844A] bg-[#f8f3eb]'
                          : 'border-gray-300 hover:border-[#D9844A]/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="flavor"
                        checked={selectedFlavors.includes(flavor)}
                        onChange={() => selectFlavor(flavor)}
                        className="h-4 w-4 text-[#D9844A] focus:ring-[#D9844A] border-gray-300"
                      />
                      <span className={`ml-3 text-sm ${
                        selectedFlavors.includes(flavor) ? 'font-semibold text-[#421500]' : 'text-gray-700'
                      }`}>
                        {flavor}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Sélection de la taille */}
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#421500] mb-3">
                  Choisissez votre taille
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedProduct.sizes.map((size) => (
                    <label
                      key={size.name}
                      className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedSize?.name === size.name
                          ? 'border-[#D9844A] bg-[#f8f3eb] shadow-md'
                          : 'border-gray-300 hover:border-[#D9844A]/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="size"
                        checked={selectedSize?.name === size.name}
                        onChange={() => setSelectedSize(size)}
                        className="sr-only"
                      />
                      <span className={`text-base font-semibold ${
                        selectedSize?.name === size.name ? 'text-[#D9844A]' : 'text-[#421500]'
                      }`}>
                        {size.name}
                      </span>
                      <span className={`text-lg font-bold mt-1 ${
                        selectedSize?.name === size.name ? 'text-[#D9844A]' : 'text-gray-700'
                      }`}>
                        {size.price}€
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsOptionsModalOpen(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmAddToCart}
                className="flex-1 bg-[#D9844A] hover:bg-[#C27340] text-white font-bold py-3 px-6 rounded-md transition-colors"
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Zoom Image */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 z-10 bg-[#D9844A] hover:bg-[#C27340] text-white p-3 rounded-full shadow-lg transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative w-full h-full">
              <Image
                src={zoomedImage}
                alt="Image agrandie"
                fill
                className="object-contain"
                sizes="100vw"
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