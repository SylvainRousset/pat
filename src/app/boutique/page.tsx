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
  category?: string; // ID de la catégorie
  flavors?: string[];
  sizes?: { name: string; price: string }[];
  flavorManagementType?: 'standard' | 'pack'; // Type de gestion des saveurs
}

// Interface pour les catégories
interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function BoutiquePage() {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('tous');
  
  // États pour la modal de sélection d'options
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<{ name: string; price: string } | null>(null);
  const [packFlavors, setPackFlavors] = useState<string[]>([]); // Pour les packs de saveurs

  // Charger les produits et catégories au chargement de la page
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les produits et catégories en parallèle
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        
        if (!productsResponse.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        
        if (!categoriesResponse.ok) {
          throw new Error('Erreur lors de la récupération des catégories');
        }
        
        const [productsData, categoriesData] = await Promise.all([
          productsResponse.json(),
          categoriesResponse.json()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        setError('Impossible de charger les données. Veuillez réessayer plus tard.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filtrer les produits par catégorie
  const getFilteredProducts = () => {
    if (selectedCategory === 'tous') {
      return products;
    }
    
    return products.filter(product => {
      // Utiliser le champ category du produit pour filtrer
      return product.category === selectedCategory;
    });
  };

  const filteredProducts = getFilteredProducts();

  const selectFlavor = (flavor: string) => {
    setSelectedFlavors([flavor]); // Une seule saveur à la fois
  };

  // Fonctions pour les packs de saveurs
  const addPackFlavor = (flavor: string) => {
    if (!selectedProduct?.sizes || !selectedSize) return;
    
    const sizeNumber = parseInt(selectedSize.name.split(' ')[0]);
    
    if (packFlavors.length < sizeNumber) {
      setPackFlavors(prev => [...prev, flavor]);
    }
  };

  const removePackFlavor = (index: number) => {
    setPackFlavors(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddToCart = (product: Product) => {
    // Si le produit a des options (saveurs ou tailles), ouvrir la modal
    if ((product.flavors && product.flavors.length > 0) || (product.sizes && product.sizes.length > 0)) {
      setSelectedProduct(product);
      setSelectedFlavors([]);
      setSelectedSize(null);
      setPackFlavors([]);
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
    
    // Vérifier si une taille doit être sélectionnée
    if (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize) {
      alert('Veuillez sélectionner une taille');
      return;
    }
    
    // Gérer selon le type de produit
    if (selectedProduct.flavorManagementType === 'pack') {
      // Mode pack : vérifier les saveurs sélectionnées
      if (selectedProduct.flavors && selectedProduct.flavors.length > 0) {
        const sizeNumber = selectedSize ? parseInt(selectedSize.name.split(' ')[0]) : 0;
        
        if (packFlavors.length === 0) {
          alert('Veuillez sélectionner au moins une saveur');
          return;
        }
        
        if (packFlavors.length !== sizeNumber) {
          alert(`Veuillez sélectionner exactement ${sizeNumber} saveur${sizeNumber > 1 ? 's' : ''} pour le pack de ${selectedSize?.name}`);
          return;
        }
      }
      
      // Construire le nom pour le pack
      let productName = `${selectedProduct.name} - Pack de ${selectedSize?.name}`;
      if (packFlavors.length > 0) {
        productName += ` (${packFlavors.join(', ')})`;
      }
      
      // Prix final
      const finalPrice = selectedSize ? selectedSize.price : selectedProduct.price;
      
      // Créer un ID unique pour le pack (préserver l'ordre des saveurs)
      const flavorsKey = packFlavors.join('-').replace(/\s+/g, '_');
      const sizeKey = selectedSize ? selectedSize.name.replace(/\s+/g, '_') : 'default';
      const uniqueId = `${selectedProduct.id}_pack_${sizeKey}_${flavorsKey}`;
      
      addToCart({
        id: uniqueId,
        name: productName,
        price: finalPrice,
        image: selectedProduct.image,
        slug: selectedProduct.name.toLowerCase().replace(/\s+/g, '-'),
        selectedFlavors: packFlavors,
        flavorManagementType: 'pack',
        portions: selectedSize?.name
      });
      
    } else {
      // Mode standard : vérifier une saveur unique
      if (selectedProduct.flavors && selectedProduct.flavors.length > 0 && selectedFlavors.length === 0) {
        alert('Veuillez sélectionner une saveur');
        return;
      }
      
      // Construire le nom pour le mode standard
      let productName = selectedProduct.name;
      if (selectedSize) {
        productName += ` (${selectedSize.name})`;
      }
      if (selectedFlavors.length > 0) {
        productName += ` - ${selectedFlavors[0]}`;
      }
      
      // Prix final
      const finalPrice = selectedSize ? selectedSize.price : selectedProduct.price;
      
      // Créer un ID unique pour le mode standard
      const flavorKey = selectedFlavors.length > 0 ? selectedFlavors[0].replace(/\s+/g, '_') : 'default';
      const sizeKey = selectedSize ? selectedSize.name.replace(/\s+/g, '_') : 'default';
      const uniqueId = `${selectedProduct.id}_${flavorKey}_${sizeKey}`;
      
      addToCart({
        id: uniqueId,
        name: productName,
        price: finalPrice,
        image: selectedProduct.image,
        slug: selectedProduct.name.toLowerCase().replace(/\s+/g, '-'),
        flavor: selectedFlavors.length > 0 ? selectedFlavors[0] : undefined,
        flavorManagementType: 'standard',
        portions: selectedSize?.name
      });
    }
    
    // Afficher la notification
    setAddedToCart(prev => ({ ...prev, [selectedProduct.id]: true }));
    
    // Fermer la modal
    setIsOptionsModalOpen(false);
    setSelectedProduct(null);
    setSelectedFlavors([]);
    setSelectedSize(null);
    setPackFlavors([]);
    
    // Réinitialiser après 2 secondes
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [selectedProduct.id]: false }));
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#E8DED0] py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-2 sm:px-3 md:px-4">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-center text-[#421500] mb-4 sm:mb-6 md:mb-8">La Boutique Coquelicot</h1>
          
          {/* Filtres par catégorie */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4">
              {/* Bouton "Tous les produits" */}
              <button
                onClick={() => setSelectedCategory('tous')}
                className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-xs sm:text-sm md:text-base transition-all duration-300 ${
                  selectedCategory === 'tous'
                    ? 'bg-[#a75120] text-white shadow-lg transform scale-105'
                    : 'bg-[#FAF0E6] text-[#421500] hover:bg-[#f1e9dc] shadow-md hover:shadow-lg'
                }`}
              >
                Tous les produits
              </button>
              
              {/* Catégories dynamiques */}
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-full font-medium text-xs sm:text-sm md:text-base transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-[#a75120] text-white shadow-lg transform scale-105'
                      : 'bg-[#FAF0E6] text-[#421500] hover:bg-[#f1e9dc] shadow-md hover:shadow-lg'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Compteur de produits */}
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-[#421500] text-xs sm:text-sm md:text-base">
              {filteredProducts.length} {filteredProducts.length > 1 ? 'produits' : 'produit'} {selectedCategory !== 'tous' ? `dans cette catégorie` : 'au total'}
            </p>
          </div>
          
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-[#FAF0E6] rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 h-full flex flex-col">
                  {/* Notification d'ajout au panier */}
                  {addedToCart[product.id] && (
                    <div className="absolute top-2 right-2 z-10 bg-green-500 text-white text-xs py-1 px-2 rounded-full animate-bounce">
                      Ajouté !
                    </div>
                  )}

                  {/* Image du produit */}
                  <Link href={`/produit/${product.id}`} className="block relative flex-shrink-0">
                    <div className="relative w-full h-48 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="object-cover hover:scale-110 transition-transform duration-300 w-full h-full"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                    </div>
                  </Link>

                  {/* Contenu de la carte */}
                  <div className="p-4 flex flex-col flex-grow">
                    {/* Nom et prix */}
                    <div className="mb-3">
                      <h2 className="text-base font-bold text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                      </h2>
                      <div className="flex items-center justify-between">
                        <span className="text-[#D9844A] font-bold text-lg">
                          {Number(product.price).toFixed(2)} €
                        </span>
                        {(product.flavors && product.flavors.length > 0) || (product.sizes && product.sizes.length > 0) ? (
                          <span className="text-xs bg-[#D9844A]/10 text-[#D9844A] px-2 py-1 rounded-full">
                            Options
                          </span>
                        ) : null}
                      </div>
                    </div>

                    {/* Description tronquée */}
                    <div className="mb-4 flex-grow">
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-auto">
                      <Link
                        href={`/produit/${product.id}`}
                        className="text-[#D9844A] hover:text-[#C27340] font-medium text-sm transition-colors"
                      >
                        Voir détails
                      </Link>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-[#D9844A] hover:bg-[#C27340] text-white text-sm px-4 py-2 rounded-md transition-colors flex items-center font-medium"
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
            <div className="text-center py-8 text-[#421500]/70">
              Aucun produit dans cette catégorie pour le moment.
            </div>
          )}
          
          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-8 text-[#421500]/70">
              Aucun produit disponible pour le moment.
            </div>
          )}
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
                  {selectedProduct.flavorManagementType === 'pack' ? 'Choisissez vos saveurs' : 'Saveurs disponibles'}
                </h4>
                
                {selectedProduct.flavorManagementType === 'pack' ? (
                  // Mode pack : sélection flexible
                  <div className="space-y-4">
                    {/* Saveurs sélectionnées */}
                    {packFlavors.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-[#421500] mb-2">Vos saveurs sélectionnées :</h5>
                        <div className="flex flex-wrap gap-2">
                          {packFlavors.map((flavor, index) => (
                            <div key={index} className="flex items-center bg-[#D9844A] text-white px-3 py-1 rounded-full text-sm">
                              <span>{flavor}</span>
                              <button
                                onClick={() => removePackFlavor(index)}
                                className="ml-2 text-white hover:text-gray-200"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Boutons pour ajouter des saveurs */}
                    <div>
                      <h5 className="text-sm font-medium text-[#421500] mb-2">Ajouter une saveur :</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.flavors.map((flavor) => {
                          const sizeNumber = selectedSize ? parseInt(selectedSize.name.split(' ')[0]) : 0;
                          const canAdd = packFlavors.length < sizeNumber;
                          
                          return (
                            <button
                              key={flavor}
                              onClick={() => addPackFlavor(flavor)}
                              disabled={!canAdd}
                              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                canAdd
                                  ? 'bg-white text-[#421500] border border-gray-300 hover:bg-gray-50'
                                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                              }`}
                            >
                              + {flavor}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Message d'état */}
                    {selectedSize && (
                      <p className={`text-xs ${
                        (() => {
                          const sizeNumber = parseInt(selectedSize.name.split(' ')[0]);
                          return packFlavors.length === sizeNumber ? 'text-green-600' : 'text-orange-500';
                        })()
                      }`}>
                        {(() => {
                          const sizeNumber = parseInt(selectedSize.name.split(' ')[0]);
                          const remaining = sizeNumber - packFlavors.length;
                          
                          if (packFlavors.length === sizeNumber) {
                            return `✅ ${packFlavors.length} saveur${packFlavors.length > 1 ? 's' : ''} sélectionnée${packFlavors.length > 1 ? 's' : ''} - Prêt à ajouter !`;
                          } else if (remaining > 0) {
                            return `⚠️ ${packFlavors.length} sur ${sizeNumber} saveurs sélectionnées - Il reste ${remaining} saveur${remaining > 1 ? 's' : ''} à choisir`;
                          } else {
                            return `❌ Trop de saveurs sélectionnées - Retirez ${Math.abs(remaining)} saveur${Math.abs(remaining) > 1 ? 's' : ''}`;
                          }
                        })()}
                      </p>
                    )}
                  </div>
                ) : (
                  // Mode standard : une saveur unique
                  <>
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
                  </>
                )}
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
                        onChange={() => {
                          setSelectedSize(size);
                          // Réinitialiser les saveurs pack si on change de taille
                          if (selectedProduct.flavorManagementType === 'pack') {
                            setPackFlavors([]);
                          }
                        }}
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
                disabled={(() => {
                  if (!selectedProduct) return true;
                  
                  // Vérifier si une taille doit être sélectionnée
                  if (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize) {
                    return true;
                  }
                  
                  // Vérifier selon le type de produit
                  if (selectedProduct.flavorManagementType === 'pack') {
                    if (selectedProduct.flavors && selectedProduct.flavors.length > 0) {
                      const sizeNumber = selectedSize ? parseInt(selectedSize.name.split(' ')[0]) : 0;
                      return packFlavors.length !== sizeNumber;
                    }
                  } else {
                    // Mode standard
                    if (selectedProduct.flavors && selectedProduct.flavors.length > 0 && selectedFlavors.length === 0) {
                      return true;
                    }
                  }
                  
                  return false;
                })()}
                className={`flex-1 font-bold py-3 px-6 rounded-md transition-colors ${
                  (() => {
                    if (!selectedProduct) return 'bg-gray-300 text-gray-500 cursor-not-allowed';
                    
                    // Vérifier si une taille doit être sélectionnée
                    if (selectedProduct.sizes && selectedProduct.sizes.length > 0 && !selectedSize) {
                      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
                    }
                    
                    // Vérifier selon le type de produit
                    if (selectedProduct.flavorManagementType === 'pack') {
                      if (selectedProduct.flavors && selectedProduct.flavors.length > 0) {
                        const sizeNumber = selectedSize ? parseInt(selectedSize.name.split(' ')[0]) : 0;
                        return packFlavors.length !== sizeNumber 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-[#D9844A] hover:bg-[#C27340] text-white';
                      }
                    } else {
                      // Mode standard
                      if (selectedProduct.flavors && selectedProduct.flavors.length > 0 && selectedFlavors.length === 0) {
                        return 'bg-gray-300 text-gray-500 cursor-not-allowed';
                      }
                    }
                    
                    return 'bg-[#D9844A] hover:bg-[#C27340] text-white';
                  })()
                }`}
              >
                Ajouter au panier
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ScrollToTop />
    </>
  );
} 