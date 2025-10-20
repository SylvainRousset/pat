'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProductById } from '@/lib/firebaseAdmin';
import { Product } from '@/lib/firebaseAdmin';

export default function ProductDetailClient({ params }: { params: { id: string } }) {
  console.log('ProductDetailClient rendu avec params:', params.id);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]); // Pour les packs de saveurs
  const selectedFlavorsRef = useRef<string[]>([]); // Ref pour persister les saveurs
  const [isAllergensExpanded, setIsAllergensExpanded] = useState(false);
  const [isOrderInfoExpanded, setIsOrderInfoExpanded] = useState(false);
  const [isTastingTipExpanded, setIsTastingTipExpanded] = useState(false);
  const isAddingRef = useRef(false);
  
  // Stabiliser les fonctions du contexte pour éviter les re-renders
  const cartContext = useCart();
  const { addMultipleToCart } = useMemo(() => cartContext, [cartContext]);

  // Chargement du produit
  useEffect(() => {
    console.log('useEffect fetchProduct appelé pour:', params.id);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(params.id);
        
        if (!productData) {
          setError('Produit non trouvé');
          return;
        }
        
        setProduct(productData);
        
        // Debug: Afficher les données du produit
        console.log('Données du produit chargées:', productData);
        console.log('Tailles disponibles:', productData.sizes);
        console.log('Saveurs disponibles:', productData.flavors);
        
        // Définir la première saveur comme sélectionnée par défaut
        if (productData.flavors && productData.flavors.length > 0) {
          console.log('Initialisation saveur par défaut:', productData.flavors[0]);
          setSelectedFlavor(productData.flavors[0]);
        }
        
        // Initialiser la taille sélectionnée avec la taille au plus petit prix
        if (productData.sizes && productData.sizes.length > 0) {
          const sortedSizes = productData.sizes.sort((a, b) => {
            const priceA = parseFloat(a.price.replace(/[^\d.,]/g, '').replace(',', '.'));
            const priceB = parseFloat(b.price.replace(/[^\d.,]/g, '').replace(',', '.'));
            return priceA - priceB;
          });
          console.log('Initialisation taille par défaut (plus petit prix):', sortedSizes[0].name);
          setSelectedSize(sortedSizes[0].name);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du produit:', err);
        setError('Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [params.id]);

  // Log pour voir les changements de saveur
  useEffect(() => {
    console.log('selectedFlavor a changé:', selectedFlavor);
  }, [selectedFlavor]);

  // Log pour voir les changements de taille
  useEffect(() => {
    console.log('selectedSize a changé:', selectedSize);
  }, [selectedSize]);

  // Log pour voir les changements de produit
  useEffect(() => {
    console.log('product a changé:', product);
    console.log('product.sizes:', product?.sizes);
  }, [product]);

  // Réinitialiser le message après 2 secondes
  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [addedToCart]);

  // Debug: Surveiller les changements de selectedFlavors
  useEffect(() => {
    console.log('=== SELECTED FLAVORS CHANGED ===');
    console.log('selectedFlavors:', selectedFlavors);
    console.log('selectedFlavors.length:', selectedFlavors.length);
    console.log('================================');
  }, [selectedFlavors]);

  // Fonction pour gérer la sélection des saveurs dans les packs
  const handleFlavorToggle = useCallback((flavor: string) => {
    if (!product?.sizes || !selectedSize) return;
    
    const selectedSizeData = product.sizes.find(size => size.name === selectedSize);
    if (!selectedSizeData) return;
    
    // Extraire le nombre de pièces de la taille (ex: "6 pièces" -> 6)
    const sizeNumber = parseInt(selectedSizeData.name.split(' ')[0]);
    
    setSelectedFlavors(prev => {
      const isSelected = prev.includes(flavor);
      
      if (isSelected) {
        // Désélectionner la saveur (toujours possible)
        return prev.filter(f => f !== flavor);
      } else {
        // Vérifier si on peut encore ajouter des saveurs
        if (prev.length < sizeNumber) {
          return [...prev, flavor];
        }
        return prev; // Ne pas ajouter si on a déjà atteint la limite
      }
    });
  }, [product, selectedSize]);

  // Fonction pour ajouter une saveur spécifique (permet les doublons)
  const handleAddFlavor = useCallback((flavor: string) => {
    if (!product?.sizes || !selectedSize) return;
    
    const selectedSizeData = product.sizes.find(size => size.name === selectedSize);
    if (!selectedSizeData) return;
    
    const sizeNumber = parseInt(selectedSizeData.name.split(' ')[0]);
    
    console.log('=== AJOUT SAVEUR ===');
    console.log('flavor:', flavor);
    console.log('selectedSize:', selectedSize);
    console.log('sizeNumber:', sizeNumber);
    console.log('selectedFlavorsRef.current avant:', selectedFlavorsRef.current);
    
    if (selectedFlavorsRef.current.length < sizeNumber) {
      const newFlavors = [...selectedFlavorsRef.current, flavor];
      selectedFlavorsRef.current = newFlavors;
      setSelectedFlavors(newFlavors);
      console.log('selectedFlavorsRef.current après:', selectedFlavorsRef.current);
    } else {
      console.log('Limite atteinte, pas d\'ajout');
    }
  }, [product, selectedSize]);

  // Fonction pour retirer une saveur spécifique
  const handleRemoveFlavor = useCallback((index: number) => {
    console.log('=== SUPPRESSION SAVEUR ===');
    console.log('index à supprimer:', index);
    console.log('selectedFlavorsRef.current avant:', selectedFlavorsRef.current);
    
    const newFlavors = selectedFlavorsRef.current.filter((_, i) => i !== index);
    selectedFlavorsRef.current = newFlavors;
    setSelectedFlavors(newFlavors);
    console.log('selectedFlavorsRef.current après:', selectedFlavorsRef.current);
  }, []);

  // Fonction pour vérifier si le bouton doit être désactivé
  const isAddButtonDisabled = useCallback(() => {
    if (isProcessing) return true;
    
    if (product?.flavorManagementType === 'pack') {
      const selectedSizeData = product.sizes?.find(size => size.name === selectedSize);
      const requiredFlavors = selectedSizeData ? parseInt(selectedSizeData.name.split(' ')[0]) : 0;
      return selectedFlavorsRef.current.length !== requiredFlavors;
    }
    
    return false;
  }, [isProcessing, product, selectedSize]);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('handleAddToCart appelé - isAddingRef.current:', isAddingRef.current, 'isProcessing:', isProcessing);
    
    // Vérification avec useRef pour éviter les appels multiples
    if (!product || isAddingRef.current || isProcessing) {
      console.log('handleAddToCart ignoré - conditions non remplies');
      return;
    }

    // Marquer comme en cours d'ajout
    isAddingRef.current = true;
    setIsProcessing(true);

    try {
      const productId = product.id;

      // Trouver la taille sélectionnée pour obtenir le prix
      const selectedSizeData = product.sizes?.find(size => size.name === selectedSize);
      const sizePrice = selectedSizeData?.price || product.price;
      
      // Nettoyer le prix pour le stockage dans le panier
      const cleanPrice = sizePrice.replace(/[^\d.,]/g, '').replace(',', '.');
      
      // Gérer selon le type de produit
      let uniqueId: string;
      let productName: string;
      
      if (product.flavorManagementType === 'pack') {
        // Mode pack : utiliser les saveurs sélectionnées
        const selectedSizeData = product.sizes?.find(size => size.name === selectedSize);
        const requiredFlavors = selectedSizeData ? parseInt(selectedSizeData.name.split(' ')[0]) : 0;
        
        console.log('=== VALIDATION PACK ===');
        console.log('selectedFlavors (état):', selectedFlavors);
        console.log('selectedFlavorsRef.current:', selectedFlavorsRef.current);
        console.log('selectedFlavorsRef.current.length:', selectedFlavorsRef.current.length);
        console.log('requiredFlavors:', requiredFlavors);
        console.log('selectedSize:', selectedSize);
        console.log('========================');
        
        if (selectedFlavorsRef.current.length === 0) {
          setError('Veuillez sélectionner au moins une saveur');
          return;
        }
        
        if (selectedFlavorsRef.current.length !== requiredFlavors) {
          setError(`Veuillez sélectionner exactement ${requiredFlavors} saveur${requiredFlavors > 1 ? 's' : ''} pour le pack de ${selectedSize}`);
          return;
        }
        
        const flavorsKey = selectedFlavorsRef.current.join('-').replace(/\s+/g, '_');
        const sizeKey = selectedSize ? selectedSize.replace(/\s+/g, '_') : 'default';
        uniqueId = `${productId}_pack_${sizeKey}_${flavorsKey}`;
        
        productName = `${product.name} - Pack de ${selectedSize}`;
        if (selectedFlavorsRef.current.length > 0) {
          productName += ` (${selectedFlavorsRef.current.join(', ')})`;
        }
      } else {
        // Mode standard : utiliser une saveur unique
        const flavorKey = selectedFlavor ? selectedFlavor.replace(/\s+/g, '_') : 'default';
        const sizeKey = selectedSize ? selectedSize.replace(/\s+/g, '_') : 'default';
        uniqueId = `${productId}_${flavorKey}_${sizeKey}`;
        
        productName = product.name;
        if (selectedFlavor) productName += ` - ${selectedFlavor}`;
        if (selectedSize) productName += ` (${selectedSize})`;
      }

      console.log('=== AJOUT AU PANIER ===');
      console.log('Produit:', product.name);
      console.log('Type:', product.flavorManagementType);
      console.log('Saveur sélectionnée:', selectedFlavor);
      console.log('Saveurs sélectionnées:', selectedFlavors);
      console.log('Taille sélectionnée:', selectedSize);
      console.log('Prix de la taille:', sizePrice);
      console.log('ID unique:', uniqueId);
      console.log('Nom final:', productName);
      console.log('Quantité:', quantity);
      console.log('========================');

      // Ajouter le produit avec la quantité sélectionnée
      const cartItem: any = {
        id: uniqueId,
        name: productName,
        price: cleanPrice,
      image: product.images && product.images.length > 0 
        ? product.images[0] 
        : (product.image || '/images/placeholder.jpg'),
        slug: product.name.toLowerCase().replace(/\s+/g, '-'),
        portions: selectedSize || undefined
      };

      // Ajouter les données spécifiques selon le type
      if (product.flavorManagementType === 'pack') {
        cartItem.selectedFlavors = selectedFlavorsRef.current;
        cartItem.flavorManagementType = 'pack';
      } else {
        cartItem.flavor = selectedFlavor || undefined;
        cartItem.flavorManagementType = 'standard';
      }

      addMultipleToCart(cartItem, quantity);
    
    // Afficher le message de confirmation
    setAddedToCart(true);
    
    // Réactiver le bouton après un court délai
    setTimeout(() => {
        isAddingRef.current = false;
        setIsProcessing(false);
        setAddedToCart(false);
      }, 1000);

    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      isAddingRef.current = false;
      setIsProcessing(false);
    }
  }, [product, quantity, isProcessing, addMultipleToCart, selectedFlavor, selectedSize]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#8B6F47] py-12">
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
        <main className="min-h-screen bg-[#8B6F47] py-12">
          <div className="container mx-auto px-4">
            <div className="bg-[#FAF0E6] rounded-lg shadow-lg p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
              <p className="text-[#421500] mb-6">{error || 'Produit non disponible'}</p>
              <Link href="/boutique" className="bg-[#a75120] hover:bg-[#8a421a] text-white px-6 py-3 rounded-md inline-block">
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
  
  // Traiter la description pour respecter la mise en page
  const productDescription = product.descriptionArray && product.descriptionArray.length > 0
    ? product.descriptionArray
    : product.description.split('\n').filter(line => line.trim() !== '');

  // Fonction pour extraire l'emoji et le texte d'un allergène
  const parseAllergen = (allergen: string) => {
    // Détecter si l'allergène commence par un emoji
    const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?)/u;
    const match = allergen.match(emojiRegex);
    
    if (match) {
      return {
        emoji: match[1],
        text: allergen.substring(match[1].length).trim()
      };
    }
    
    // Si pas d'emoji, retourner juste le texte
    return {
      emoji: null,
      text: allergen
    };
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#8B6F47] py-12">
        <div className="container mx-auto px-4">
          <Link href="/boutique" className="inline-flex items-center text-[#FAF0E6] hover:text-[#E8A870] mb-8">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à la boutique
          </Link>
          
          <div className="bg-[#FAF0E6] rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Colonne gauche - Images */}
              <div className="space-y-6">
                <div className="relative aspect-square w-full max-w-md mx-auto rounded-lg overflow-hidden border border-gray-200 cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
                  {productImages.length > 0 ? (
                    <Image
                      src={productImages[selectedImage]}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      quality={90}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-lg">Image non disponible</span>
                    </div>
                  )}
                  {/* Icône de zoom */}
                  <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
                
                {/* Miniatures */}
                {productImages.length > 1 && (
                  <div className="max-w-md mx-auto">
                    <div className="grid grid-cols-4 gap-2">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                            selectedImage === index ? 'border-[#a75120] shadow-md' : 'border-gray-200 hover:border-[#a75120]/50'
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Miniature ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                          sizes="80px"
                        />
                      </button>
                    ))}
                    </div>
                  </div>
                )}
                
                {/* Description sous les images - Visible seulement sur desktop */}
                <div className="mt-8 space-y-4 text-[#421500] hidden md:block">
                  {productDescription.map((paragraph, index) => {
                    // Détecter les listes à puces
                    if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
                      return (
                        <div key={index} className="flex items-start">
                          <span className="text-[#a75120] mr-2 mt-1">•</span>
                          <p className="leading-relaxed flex-1">
                            {paragraph.trim().substring(1).trim()}
                          </p>
                        </div>
                      );
                    }
                    
                    // Paragraphes normaux
                    return (
                    <p key={index} className="leading-relaxed">
                      {paragraph}
                    </p>
                    );
                  })}
                </div>
              </div>
              
              {/* Colonne droite - Informations produit */}
              <div className="space-y-6">
                {/* Nom du produit */}
                <div className="mt-4">
                  <h1 className="text-2xl font-bold text-[#421500] mb-2">{String(product.name)}</h1>
                  {(typeof product.title === "string" && product.title) && (
                    <h2 className="text-lg text-[#a75120] font-medium">{product.title}</h2>
                  )}
                </div>
                
                {/* Prix */}
                <div className="py-4 border-t border-b border-[#a75120]/20">
                  <p className="text-3xl font-bold text-[#a75120]">
                    {selectedSize && product.sizes?.find(size => size.name === selectedSize)?.price 
                      ? `${product.sizes.find(size => size.name === selectedSize)?.price} €`
                      : product.sizes && product.sizes.length > 0
                        ? `${product.sizes[0].price} €`
                        : `${product.price} €`
                    }
                  </p>
                  {selectedSize && (
                    <p className="text-sm text-[#421500] mt-1">pour {selectedSize}</p>
                  )}
                </div>


                {/* Choix des saveurs - Visible seulement sur mobile */}
                {product.flavors && product.flavors.length > 0 && (
                  <div className="pt-4 md:hidden">
                    <label className="block text-sm font-medium text-[#421500] mb-3">
                      {product.flavorManagementType === 'pack' ? 'Choisissez vos saveurs' : 'Saveurs disponibles'}
                    </label>
                    
                    {product.flavorManagementType === 'pack' ? (
                      // Mode pack : sélection flexible
                      <div className="space-y-4">
                        {/* Saveurs sélectionnées */}
                        {selectedFlavors.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-[#421500] mb-2">Vos saveurs sélectionnées :</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedFlavors.map((flavor, index) => (
                                <div key={index} className="flex items-center bg-[#a75120] text-white px-3 py-1 rounded-full text-sm">
                                  <span>{flavor}</span>
                                  <button
                                    onClick={() => handleRemoveFlavor(index)}
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
                          <h4 className="text-sm font-medium text-[#421500] mb-2">Ajouter une saveur :</h4>
                          <div className="flex flex-wrap gap-2">
                            {product.flavors.map((flavor) => {
                              const selectedSizeData = product.sizes?.find(size => size.name === selectedSize);
                              const sizeNumber = selectedSizeData ? parseInt(selectedSizeData.name.split(' ')[0]) : 0;
                              const canAdd = selectedFlavors.length < sizeNumber;
                              
                              return (
                                <button
                                  key={flavor}
                                  onClick={() => handleAddFlavor(flavor)}
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
                              const selectedSizeData = product.sizes?.find(size => size.name === selectedSize);
                              const requiredFlavors = selectedSizeData ? parseInt(selectedSizeData.name.split(' ')[0]) : 0;
                              return selectedFlavors.length === requiredFlavors ? 'text-green-600' : 'text-orange-500';
                            })()
                          }`}>
                            {(() => {
                              const selectedSizeData = product.sizes?.find(size => size.name === selectedSize);
                              const requiredFlavors = selectedSizeData ? parseInt(selectedSizeData.name.split(' ')[0]) : 0;
                              const remaining = requiredFlavors - selectedFlavors.length;
                              
                              if (selectedFlavors.length === requiredFlavors) {
                                return `✅ ${selectedFlavors.length} saveur${selectedFlavors.length > 1 ? 's' : ''} sélectionnée${selectedFlavors.length > 1 ? 's' : ''} - Prêt à ajouter !`;
                              } else if (remaining > 0) {
                                return `⚠️ ${selectedFlavors.length} sur ${requiredFlavors} saveurs sélectionnées - Il reste ${remaining} saveur${remaining > 1 ? 's' : ''} à choisir`;
                              } else {
                                return `❌ Trop de saveurs sélectionnées - Retirez ${Math.abs(remaining)} saveur${Math.abs(remaining) > 1 ? 's' : ''}`;
                              }
                            })()}
                          </p>
                        )}
                      </div>
                    ) : (
                      // Mode standard : dropdown
                      <select
                        id="flavor-select"
                        value={selectedFlavor}
                        onChange={(e) => {
                          console.log('Saveur changée de', selectedFlavor, 'vers', e.target.value);
                          setSelectedFlavor(e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#a75120] focus:border-[#a75120] bg-white text-[#421500]"
                      >
                        {product.flavors.map((flavor) => (
                          <option key={flavor} value={flavor}>
                            {flavor}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {/* Choix des tailles - Visible seulement sur mobile */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="pt-4 md:hidden">
                    <label htmlFor="size-select" className="block text-sm font-medium text-[#421500] mb-3">
                      Tailles disponibles
                    </label>
                    <select
                      id="size-select"
                      value={selectedSize}
                      onChange={(e) => {
                        console.log('Taille changée de', selectedSize, 'vers', e.target.value);
                        setSelectedSize(e.target.value);
                        // Réinitialiser les saveurs sélectionnées pour les packs
                        if (product?.flavorManagementType === 'pack') {
                          console.log('Réinitialisation des saveurs à cause du changement de taille');
                          selectedFlavorsRef.current = [];
                          setSelectedFlavors([]);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#a75120] focus:border-[#a75120] bg-white text-[#421500]"
                    >
                      {product.sizes.map((size) => (
                        <option key={size.name} value={size.name}>
                          {size.name} - {size.price}€
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sélecteur de quantité - Visible seulement sur mobile */}
                <div className="pt-4 md:hidden">
                  <label htmlFor="quantity" className="block text-sm font-medium text-[#421500] mb-2">
                    Quantité
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border-2 border-[#a75120] text-[#a75120] hover:bg-[#a75120] hover:text-white transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-lg font-bold text-[#421500] min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full border-2 border-[#a75120] text-[#a75120] hover:bg-[#a75120] hover:text-white transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Bouton Ajouter au panier - Visible seulement sur mobile */}
                <div className="pt-6 md:hidden">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddButtonDisabled()}
                    className={`w-full py-3 px-6 rounded-md font-medium transition-colors flex items-center justify-center ${
                      isAddButtonDisabled() || addedToCart
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-[#a75120] hover:bg-[#8a421a] text-white'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Ajout en cours...
                      </>
                    ) : addedToCart ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Ajouté au panier !
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Ajouter au panier
                      </>
                    )}
                  </button>
                </div>

                {/* Description - Visible seulement sur mobile, après le bouton */}
                <div className="py-4 border-t border-[#a75120]/20 md:hidden">
                  <h3 className="text-lg font-semibold text-[#421500] mb-3">Description</h3>
                  <div className="space-y-3 text-[#421500]">
                    {productDescription.map((paragraph, index) => {
                      // Détecter les listes à puces
                      if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
                        return (
                          <div key={index} className="flex items-start">
                            <span className="text-[#a75120] mr-2 mt-1">•</span>
                            <p className="text-sm leading-relaxed">{paragraph.trim().substring(1).trim()}</p>
                          </div>
                        );
                      }
                      return (
                        <p key={index} className="text-sm leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </div>
                
                {/* Choix des saveurs - Visible seulement sur desktop */}
                {product.flavors && product.flavors.length > 0 && (
                  <div className="pt-4 hidden md:block">
                    <label className="block text-sm font-medium text-[#421500] mb-3">
                      {product.flavorManagementType === 'pack' ? 'Choisissez vos saveurs' : 'Choisissez votre saveur'}
                    </label>
                    
                    {product.flavorManagementType === 'pack' ? (
                      // Mode pack : sélection flexible
                      <div className="space-y-4">
                        {/* Saveurs sélectionnées */}
                        {selectedFlavors.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-[#421500] mb-2">Vos saveurs sélectionnées :</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedFlavors.map((flavor, index) => (
                                <div key={index} className="flex items-center bg-[#a75120] text-white px-3 py-1 rounded-full text-sm">
                                  <span>{flavor}</span>
                                  <button
                                    onClick={() => handleRemoveFlavor(index)}
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
                          <h4 className="text-sm font-medium text-[#421500] mb-2">Ajouter une saveur :</h4>
                          <div className="flex flex-wrap gap-2">
                            {product.flavors.map((flavor) => {
                              const selectedSizeData = product.sizes?.find(size => size.name === selectedSize);
                              const sizeNumber = selectedSizeData ? parseInt(selectedSizeData.name.split(' ')[0]) : 0;
                              const canAdd = selectedFlavors.length < sizeNumber;
                              
                              return (
                                <button
                                  key={flavor}
                                  onClick={() => handleAddFlavor(flavor)}
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
                              const selectedSizeData = product.sizes?.find(size => size.name === selectedSize);
                              const requiredFlavors = selectedSizeData ? parseInt(selectedSizeData.name.split(' ')[0]) : 0;
                              return selectedFlavors.length === requiredFlavors ? 'text-green-600' : 'text-orange-500';
                            })()
                          }`}>
                            {(() => {
                              const selectedSizeData = product.sizes?.find(size => size.name === selectedSize);
                              const requiredFlavors = selectedSizeData ? parseInt(selectedSizeData.name.split(' ')[0]) : 0;
                              const remaining = requiredFlavors - selectedFlavors.length;
                              
                              if (selectedFlavors.length === requiredFlavors) {
                                return `✅ ${selectedFlavors.length} saveur${selectedFlavors.length > 1 ? 's' : ''} sélectionnée${selectedFlavors.length > 1 ? 's' : ''} - Prêt à ajouter !`;
                              } else if (remaining > 0) {
                                return `⚠️ ${selectedFlavors.length} sur ${requiredFlavors} saveurs sélectionnées - Il reste ${remaining} saveur${remaining > 1 ? 's' : ''} à choisir`;
                              } else {
                                return `❌ Trop de saveurs sélectionnées - Retirez ${Math.abs(remaining)} saveur${Math.abs(remaining) > 1 ? 's' : ''}`;
                              }
                            })()}
                          </p>
                        )}
                      </div>
                    ) : (
                      // Mode standard : dropdown
                      <>
                        <div className="text-xs text-gray-500 mb-2">
                          Saveur actuellement sélectionnée: <strong>{selectedFlavor}</strong>
                        </div>
                        <select
                          id="flavor-select"
                          value={selectedFlavor}
                          onChange={(e) => {
                            console.log('Saveur changée de', selectedFlavor, 'vers', e.target.value);
                            setSelectedFlavor(e.target.value);
                          }}
                          className="w-64 max-w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#a75120] focus:border-[#a75120] bg-white text-[#421500]"
                        >
                          {product.flavors.map((flavor) => (
                            <option key={flavor} value={flavor}>
                              {flavor}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                )}

                {/* Sélection de la taille - Visible seulement sur desktop */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="pt-4 hidden md:block">
                    <label htmlFor="size-select" className="block text-sm font-medium text-[#421500] mb-3">
                      Choisissez le nombre de parts
                    </label>
                    <div className="text-xs text-gray-500 mb-2">
                      Taille actuellement sélectionnée: <strong>{selectedSize}</strong>
                    </div>
                    <select
                      id="size-select"
                      value={selectedSize}
                      onChange={(e) => {
                        console.log('Taille changée de', selectedSize, 'vers', e.target.value);
                        setSelectedSize(e.target.value);
                        // Réinitialiser les saveurs sélectionnées pour les packs
                        if (product?.flavorManagementType === 'pack') {
                          console.log('Réinitialisation des saveurs à cause du changement de taille');
                          selectedFlavorsRef.current = [];
                          setSelectedFlavors([]);
                        }
                      }}
                      className="w-64 max-w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#a75120] focus:border-[#a75120] bg-white text-[#421500]"
                    >
                      {product.sizes.map((size) => (
                        <option key={size.name} value={size.name}>
                          {size.name} - {size.price}€
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {product.address && (
                  <div className="py-3 border-t border-b border-[#a75120]/20">
                    <p className="flex items-start">
                      <svg className="w-5 h-5 mr-2 mt-0.5 text-[#a75120]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[#421500]">{product.address}</span>
                    </p>
                  </div>
                )}
                
                {/* Sélecteur de quantité - Visible seulement sur desktop */}
                <div className="pt-4 hidden md:block">
                  <label htmlFor="quantity" className="block text-sm font-medium text-[#421500] mb-2">
                    Quantité
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border-2 border-[#a75120] text-[#a75120] hover:bg-[#a75120] hover:text-white transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="text-lg font-bold text-[#421500] min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full border-2 border-[#a75120] text-[#a75120] hover:bg-[#a75120] hover:text-white transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Bouton d'ajout au panier - Visible seulement sur desktop */}
                <div className="pt-4 hidden md:block">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddButtonDisabled()}
                    type="button"
                    className={`w-44 ${isAddButtonDisabled() ? 'bg-[#a75120]/70 cursor-not-allowed' : 'bg-[#a75120] hover:bg-[#8a421a]'} text-white font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center text-sm whitespace-nowrap`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {isProcessing ? 'Ajout en cours...' : addedToCart ? 'Ajouté !' : 'Ajouter au panier'}
                  </button>
                </div>
                
                {product.notice && (
                  <div className="mt-4 p-4 bg-[#f8f3eb] rounded-md border border-[#a75120]/30">
                    <div className="flex items-center text-[#421500] font-medium">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {product.notice}
                    </div>
                  </div>
                )}
                
                {product.allergens && product.allergens.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center mb-4">
                      <h2 className="text-xl font-bold text-[#421500]">Allergènes</h2>
                      <button
                        onClick={() => setIsAllergensExpanded(!isAllergensExpanded)}
                        className="ml-3 flex items-center justify-center w-8 h-8 text-[#a75120] hover:text-[#8a421a] hover:bg-[#a75120]/10 rounded-full transition-colors"
                      >
                        {isAllergensExpanded ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        )}
                      </button>
                    </div>
                    
                    {isAllergensExpanded && (
                      <>
                        <p className="text-[#421500] mb-4">
                      Il est essentiel de prendre en compte les allergènes lors de la consommation alimentaire.
                    </p>
                        <p className="text-[#421500] mb-4">
                      Certains des allergènes connus incluent :
                    </p>
                        <ul className="space-y-3 text-[#421500]">
                          {product.allergens.map((allergen, index) => {
                            const { emoji, text } = parseAllergen(allergen);
                            return (
                              <li key={index} className="flex items-center space-x-3 p-3 bg-[#f8f3eb] rounded-lg border border-[#a75120]/20">
                                {emoji && (
                                  <div className="text-2xl flex-shrink-0">
                                    {emoji}
                                  </div>
                                )}
                                <span className="font-medium">{text}</span>
                        </li>
                            );
                          })}
                    </ul>
                        <p className="text-[#421500] mt-4">
                      La sensibilisation aux allergènes alimentaires est cruciale pour assurer la sécurité de tous, en particulier des personnes souffrant d&apos;allergies sévères.
                    </p>
                        <p className="text-[#421500] mt-4">
                      En intégrant ces précautions dans la présentation des aliments, je favorise un environnement alimentaire plus sûr et inclusif.
                    </p>
                      </>
                    )}
                  </div>
                )}
                
                {/* Séparateur simple */}
                <div className="mt-8 mb-8">
                  <div className="w-full h-px bg-[#a75120]/20"></div>
                </div>
                
                {/* Section Commande 48h */}
                <div className="mt-8">
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-bold text-[#421500]">Commandez 48h à l&apos;avance</h2>
                    <button
                      onClick={() => setIsOrderInfoExpanded(!isOrderInfoExpanded)}
                      className="ml-3 flex items-center justify-center w-8 h-8 text-[#a75120] hover:text-[#8a421a] hover:bg-[#a75120]/10 rounded-full transition-colors"
                    >
                      {isOrderInfoExpanded ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {isOrderInfoExpanded && (
                    <div className="space-y-4 text-[#421500]">
                      <p>
                        Pour profiter pleinement de mes services, je vous encourage à passer commande au moins 48 heures à l&apos;avance.
                      </p>
                      <p>
                        Cela me permet de préparer votre commande avec soin et de garantir que tout soit prêt à votre arrivée.
                      </p>
                      <p>
                        Chaque pâtisserie est réalisée le jour même pour vous offrir une fraîcheur incomparable, une texture parfaite et des saveurs préservées.
                      </p>
                      <p>
                        Une fois votre commande confirmée, je serai ravi de vous accueillir directement dans mon local.
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Séparateur simple */}
                <div className="mt-8 mb-8">
                  <div className="w-full h-px bg-[#a75120]/20"></div>
                </div>
                
                {/* Section Conseil de Dégustation */}
                <div className="mt-8">
                  <div className="flex items-center mb-4">
                    <h2 className="text-xl font-bold text-[#421500]">Conseil de Dégustation</h2>
                    <button
                      onClick={() => setIsTastingTipExpanded(!isTastingTipExpanded)}
                      className="ml-3 flex items-center justify-center w-8 h-8 text-[#a75120] hover:text-[#8a421a] hover:bg-[#a75120]/10 rounded-full transition-colors"
                    >
                      {isTastingTipExpanded ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {isTastingTipExpanded && (
                    <div className="space-y-4 text-[#421500]">
                      <p>
                        Pour une dégustation optimale, je vous conseille de savourer votre dessert dans les 48 heures suivant sa réception.
                      </p>
                      <p>
                        Conservez-le au réfrigérateur entre 0°C et +4°C jusqu&apos;au moment de servir.
                      </p>
                      <p>
                        Pensez à sortir la pâtisserie 5 minutes avant la dégustation : cela permet aux saveurs de pleinement s&apos;exprimer, car le froid a tendance à atténuer les arômes délicats.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Galerie en pleine page */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full w-full h-full flex flex-col">
            {/* Bouton fermer */}
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image principale */}
            <div className="flex-1 flex items-center justify-center">
              {productImages.length > 0 && (
                <Image
                  src={productImages[selectedImage]}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                  quality={100}
                />
              )}
            </div>

            {/* Navigation */}
            {productImages.length > 1 && (
              <>
                {/* Bouton précédent */}
                <button
                  onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : productImages.length - 1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Bouton suivant */}
                <button
                  onClick={() => setSelectedImage(selectedImage < productImages.length - 1 ? selectedImage + 1 : 0)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Miniatures en bas */}
                <div className="flex justify-center space-x-1 py-4">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-white' : 'border-white/50 hover:border-white'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Miniature ${index + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>

                {/* Compteur d'images */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {productImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
} 