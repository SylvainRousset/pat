'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';

// Type pour les produits
interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  showInCreations: boolean;
  showOnHome: boolean;
  portions?: string;
  address?: string;
  images?: string[];
  descriptionArray?: string[];
  allergens?: string[];
  notice?: string;
  flavors?: string[];
  sizes?: { name: string; price: string }[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: '',
    image: '',
    description: '',
    showInCreations: true,
    showOnHome: true
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [additionalImagesFiles, setAdditionalImagesFiles] = useState<File[]>([]);
  
  // États pour les images des cartes d'accueil
  const [carte1File, setCarte1File] = useState<File | null>(null);
  const [carte2File, setCarte2File] = useState<File | null>(null);
  const [carte1Preview, setCarte1Preview] = useState<string>('/images/carteacc1.avif');
  const [carte2Preview, setCarte2Preview] = useState<string>('/images/carteacc2.avif');
  const [isUploadingCartes, setIsUploadingCartes] = useState(false);

  // États pour les saveurs, tailles et allergènes
  const [flavors, setFlavors] = useState<string[]>([]);
  const [currentFlavor, setCurrentFlavor] = useState('');
  const [sizes, setSizes] = useState<{ name: string; price: string }[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [customAllergen, setCustomAllergen] = useState('');

  // Portions disponibles
  const availableSizes = ['2', '4', '6', '10', '12'];

  // Liste des allergènes disponibles
  const availableAllergens = [
    'Gluten',
    'Œufs',
    '🥛 Lactose',
    'Fruits à coque',
    'Arachides',
    'Soja',
    'Sésame',
    'Sulfites',
    'Céleri',
    'Moutarde',
    'Lupin',
    'Mollusques',
    'Crustacés',
    'Poisson'
  ];

  // Vérifier l'authentification et charger les produits au chargement de la page
  useEffect(() => {
    const checkAuth = () => {
      // Utiliser Firebase Auth pour vérifier l'authentification
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
          localStorage.setItem('adminAuthenticated', 'true');
          // Charger les produits depuis l'API
          fetchProducts();
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('adminAuthenticated');
          router.push('/admin');
        }
      });
      
      return unsubscribe;
    };
    
    const unsubscribe = checkAuth();
    return () => unsubscribe();
  }, [router]);

  // Fonction pour récupérer les produits
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setErrorMessage('Erreur lors du chargement des produits');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gestion des images des cartes d'accueil
  const handleCarte1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCarte1File(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCarte1Preview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCarte2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCarte2File(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCarte2Preview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadCartes = async () => {
    if (!carte1File && !carte2File) {
      setErrorMessage('Veuillez sélectionner au moins une image à modifier');
      return;
    }

    try {
      setIsUploadingCartes(true);
      setErrorMessage('');
      setSuccessMessage('');

      // Upload carte 1 si sélectionnée
      if (carte1File) {
        const formData1 = new FormData();
        formData1.append('file', carte1File);
        formData1.append('fileName', 'carteacc1.avif');
        
        const response1 = await fetch('/api/upload-carte', {
          method: 'POST',
          body: formData1,
        });

        if (!response1.ok) {
          throw new Error('Erreur lors de l\'upload de la carte 1');
        }
      }

      // Upload carte 2 si sélectionnée
      if (carte2File) {
        const formData2 = new FormData();
        formData2.append('file', carte2File);
        formData2.append('fileName', 'carteacc2.avif');
        
        const response2 = await fetch('/api/upload-carte', {
          method: 'POST',
          body: formData2,
        });

        if (!response2.ok) {
          throw new Error('Erreur lors de l\'upload de la carte 2');
        }
      }

      setSuccessMessage('Images des cartes mises à jour avec succès !');
      setCarte1File(null);
      setCarte2File(null);
      
      // Recharger la page après 2 secondes
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Erreur lors de la mise à jour des images');
    } finally {
      setIsUploadingCartes(false);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: checked }));
  };

  // Gestion des saveurs
  const addFlavor = () => {
    if (currentFlavor.trim()) {
      setFlavors([...flavors, currentFlavor.trim()]);
      setCurrentFlavor('');
    }
  };

  const removeFlavor = (index: number) => {
    setFlavors(flavors.filter((_, i) => i !== index));
  };

  // Gestion des tailles
  const addOrUpdateSize = (sizeName: string, price: string) => {
    const existingIndex = sizes.findIndex(s => s.name === sizeName);
    
    if (price.trim() === '') {
      // Si le prix est vide, on supprime cette taille
      if (existingIndex !== -1) {
        setSizes(sizes.filter((_, i) => i !== existingIndex));
      }
    } else {
      // Sinon on ajoute ou met à jour
      if (existingIndex !== -1) {
        const newSizes = [...sizes];
        newSizes[existingIndex] = { name: sizeName, price: price.trim() };
        setSizes(newSizes);
      } else {
        setSizes([...sizes, { name: sizeName, price: price.trim() }]);
      }
    }
  };

  const removeSize = (sizeName: string) => {
    setSizes(sizes.filter(s => s.name !== sizeName));
  };

  // Gestion des allergènes
  const toggleAllergen = (allergen: string) => {
    if (selectedAllergens.includes(allergen)) {
      setSelectedAllergens(selectedAllergens.filter(a => a !== allergen));
    } else {
      setSelectedAllergens([...selectedAllergens, allergen]);
    }
  };

  const addCustomAllergen = () => {
    if (customAllergen.trim() && !selectedAllergens.includes(customAllergen.trim())) {
      setSelectedAllergens([...selectedAllergens, customAllergen.trim()]);
      setCustomAllergen('');
    }
  };

  const removeAllergen = (allergen: string) => {
    setSelectedAllergens(selectedAllergens.filter(a => a !== allergen));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('adminAuthenticated');
      router.push('/admin');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      setErrorMessage('Tous les champs sont obligatoires');
      return;
    }
    
    // Vérifier si une image a été sélectionnée
    if (!imageFile) {
      setErrorMessage('Veuillez sélectionner une image');
      return;
    }
    
    try {
      setErrorMessage('');
      setSuccessMessage('Traitement en cours...');
      
      // Télécharger l'image principale
      let imagePath = '';
      const additionalImagePaths: string[] = [...additionalImages];
      
      setSuccessMessage('Téléchargement de l&apos;image principale en cours...');
        
        // Créer un FormData pour l'upload
        const formData = new FormData();
        formData.append('file', imageFile);
        
        try {
          // Télécharger l'image
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || 'Erreur lors du téléchargement de l&apos;image');
          }
          
          const responseData = await uploadResponse.json();
          
          if (!responseData.imageUrl) {
            throw new Error('URL de l&apos;image non reçue du serveur');
          }
          
          imagePath = responseData.imageUrl;
          setSuccessMessage('Image principale téléchargée avec succès.');
        } catch (uploadError) {
          console.error('Erreur lors de l&apos;upload:', uploadError);
          setErrorMessage(`Erreur lors du téléchargement de l&apos;image: ${uploadError instanceof Error ? uploadError.message : 'Erreur inconnue'}`);
          return; // Arrêter l'exécution si l'upload échoue
        }
      
      // Télécharger les images additionnelles
      if (additionalImagesFiles.length > 0) {
        setSuccessMessage('Téléchargement des images additionnelles en cours...');
        
        for (const file of additionalImagesFiles) {
          try {
            const formData = new FormData();
            formData.append('file', file);
            
            const uploadResponse = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            
            if (!uploadResponse.ok) {
              console.error('Erreur lors du téléchargement d&apos;une image additionnelle');
              continue; // Continuer avec les autres images même si une échoue
            }
            
            const responseData = await uploadResponse.json();
            
            if (responseData.imageUrl) {
              additionalImagePaths.push(responseData.imageUrl);
            }
          } catch (error) {
            console.error('Erreur lors du téléchargement d&apos;une image additionnelle:', error);
            // Continuer avec les autres images
          }
        }
      }
      
      // Préparer les données du produit
      const productToAdd = {
        ...newProduct,
        image: imagePath,
        images: [imagePath, ...additionalImagePaths],
        flavors: flavors.length > 0 ? flavors : undefined,
        sizes: sizes.length > 0 ? sizes : undefined,
        allergens: selectedAllergens.length > 0 ? selectedAllergens : undefined
      };
      
      setSuccessMessage('Ajout du produit en cours...');
      
      // Ajouter le produit via l'API
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productToAdd),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l&apos;ajout du produit');
      }
      
      const addedProduct = await response.json();
      
      // Mettre à jour la liste des produits
      setProducts(prev => [...prev, addedProduct]);
      
      // Réinitialiser le formulaire
      setNewProduct({
        name: '',
        price: '',
        image: '',
        description: '',
        showInCreations: true,
        showOnHome: true
      });
      setImageFile(null);
      setImagePreview('');
      setAdditionalImages([]);
      setAdditionalImagesFiles([]);
      setFlavors([]);
      setSizes([]);
      setSelectedAllergens([]);
      setCustomAllergen('');
      
      // Afficher un message de succès
      setSuccessMessage('Produit ajouté avec succès !');
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Erreur complète:', error);
      setErrorMessage((error as Error).message || 'Erreur lors de l&apos;ajout du produit');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }
    
    try {
      // Afficher un message en cours...
      setSuccessMessage('Suppression en cours...');
      setErrorMessage('');
      
      console.log('Tentative de suppression du produit avec ID:', id);
      
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
      
      // Vérifier le statut de la réponse
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur de suppression:', errorData);
        throw new Error(errorData.error || `Erreur lors de la suppression du produit (${response.status})`);
      }
      
      // Récupérer la réponse JSON
      const data = await response.json();
      console.log('Réponse de suppression:', data);
      
      // Mettre à jour la liste des produits
      setProducts(products.filter(product => product.id !== id));
      setSuccessMessage('Produit supprimé avec succès !');
      
      // Fermer la modal si elle est ouverte
      if (selectedProduct?.id === id) {
        setIsDetailsModalOpen(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error('Erreur complète lors de la suppression:', error);
      setErrorMessage((error as Error).message || 'Erreur lors de la suppression du produit');
      setSuccessMessage('');
    }
  };

  // Vérifier l'authentification avant d'afficher le contenu
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Vérification de l&apos;authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#f8f5f0] ${!isAuthenticated ? 'hidden' : ''}`}>
      {/* Header du tableau de bord */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            Déconnexion
          </button>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* ... reste du contenu ... */}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {/* Section Gestion des Images Cartes Accueil */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Images des Cartes - Page d&apos;Accueil</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Carte 1 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#a75120]">Carte Boutique (carteacc1.avif)</h3>
              <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={carte1Preview}
                  alt="Carte Boutique Preview"
                  fill
                  className="object-contain"
                  key={carte1Preview}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCarte1Change}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#a75120] file:text-white hover:file:bg-[#8a421a]"
              />
            </div>

            {/* Carte 2 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#a75120]">Carte Événementielle (carteacc2.avif)</h3>
              <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={carte2Preview}
                  alt="Carte Événementielle Preview"
                  fill
                  className="object-contain"
                  key={carte2Preview}
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCarte2Change}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#a75120] file:text-white hover:file:bg-[#8a421a]"
              />
            </div>
          </div>

          {/* Bouton de sauvegarde */}
          <div className="mt-6 text-center">
            <button
              onClick={handleUploadCartes}
              disabled={isUploadingCartes || (!carte1File && !carte2File)}
              className={`px-6 py-3 text-white rounded-md font-semibold ${
                isUploadingCartes || (!carte1File && !carte2File)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#a75120] hover:bg-[#8a421a]'
              }`}
            >
              {isUploadingCartes ? 'Mise à jour en cours...' : 'Mettre à jour les cartes'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire d'ajout de produit */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ajouter un produit</h2>
              
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Prix
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    placeholder="ex: 18 €"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Image du produit
                  </label>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="file"
                      id="imageFile"
                      name="imageFile"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      required
                    />
                    
                    {imagePreview && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-1">Aperçu :</p>
                        <div className="relative h-32 w-32 rounded overflow-hidden border border-gray-300">
                          <Image
                            src={imagePreview}
                            alt="Aperçu de l&apos;image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="additionalImages" className="block text-sm font-medium text-gray-700 mb-1">
                    Images additionnelles (facultatif)
                  </label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      id="additionalImagesFiles"
                      name="additionalImagesFiles"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const filesArray = Array.from(e.target.files);
                          setAdditionalImagesFiles(prev => [...prev, ...filesArray]);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                    
                    {additionalImagesFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-1">Images sélectionnées: {additionalImagesFiles.length}</p>
                        <div className="flex flex-wrap gap-2">
                          {additionalImagesFiles.map((file, index) => (
                            <div key={index} className="relative group">
                              <div className="relative h-16 w-16 rounded overflow-hidden border border-gray-300">
                                <Image
                                  src={URL.createObjectURL(file)}
                                  alt={`Image ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const newFiles = [...additionalImagesFiles];
                                  newFiles.splice(index, 1);
                                  setAdditionalImagesFiles(newFiles);
                                }}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <textarea
                      id="additionalImages"
                      name="additionalImages"
                      placeholder="Ou entrez les URLs des images additionnelles (une par ligne)"
                      value={additionalImages.join('\n')}
                      onChange={(e) => {
                        const urls = e.target.value.split('\n').filter(url => url.trim() !== '');
                        setAdditionalImages(urls);
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                </div>
                
                {/* Saveurs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saveurs (optionnel)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={currentFlavor}
                      onChange={(e) => setCurrentFlavor(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFlavor())}
                      placeholder="Ex: Chocolat Passion"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#a75120] focus:border-[#a75120]"
                    />
                    <button
                      type="button"
                      onClick={addFlavor}
                      className="px-4 py-2 bg-[#a75120] text-white rounded-md hover:bg-[#8a421a]"
                    >
                      Ajouter
                    </button>
                  </div>
                  {flavors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {flavors.map((flavor, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#f8f3eb] text-[#421500] border border-[#a75120]/30">
                          {flavor}
                          <button
                            type="button"
                            onClick={() => removeFlavor(index)}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tailles et prix */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de parts (optionnel)
                  </label>
                  <p className="text-xs text-gray-500 mb-3">Cochez les portions disponibles et leurs prix (le client choisira UNE portion)</p>
                  <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                    {availableSizes.map((sizeNum) => {
                      const existingSize = sizes.find(s => s.name === `${sizeNum} parts`);
                      return (
                        <div key={sizeNum} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`size-${sizeNum}`}
                            checked={!!existingSize}
                            onChange={(e) => {
                              if (!e.target.checked) {
                                removeSize(`${sizeNum} parts`);
                              } else {
                                setSizes([...sizes, { name: `${sizeNum} parts`, price: '' }]);
                              }
                            }}
                            className="h-4 w-4 text-[#a75120] focus:ring-[#a75120] border-gray-300 rounded"
                          />
                          <label htmlFor={`size-${sizeNum}`} className="text-sm text-gray-700 w-16 cursor-pointer">
                            {sizeNum} parts
                          </label>
                          {existingSize && (
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="number"
                                step="0.01"
                                value={existingSize.price}
                                onChange={(e) => addOrUpdateSize(`${sizeNum} parts`, e.target.value)}
                                placeholder="Prix"
                                className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-[#a75120] focus:border-[#a75120] text-sm"
                              />
                              <span className="text-sm text-gray-600">€</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {sizes.length > 0 && (
                    <div className="mt-3 p-2 bg-[#f8f3eb] rounded-md border border-[#a75120]/30">
                      <p className="text-xs font-semibold text-[#421500] mb-1">Portions proposées :</p>
                      {sizes.map((size) => (
                        <div key={size.name} className="text-xs text-[#421500]">
                          • {size.name} : {size.price || '(prix manquant)'}€
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Allergènes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergènes (optionnel)
                  </label>
                  <p className="text-xs text-gray-500 mb-3 italic">
                    Il est essentiel de prendre en compte les allergènes lors de la consommation alimentaire.
                  </p>
                  
                  {/* Allergènes prédéfinis */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-md mb-3">
                    {availableAllergens.map((allergen) => (
                      <div key={allergen} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`allergen-${allergen}`}
                          checked={selectedAllergens.includes(allergen)}
                          onChange={() => toggleAllergen(allergen)}
                          className="h-4 w-4 text-[#a75120] focus:ring-[#a75120] border-gray-300 rounded"
                        />
                        <label htmlFor={`allergen-${allergen}`} className="ml-2 block text-sm text-gray-700">
                          {allergen}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Ajouter un allergène personnalisé */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={customAllergen}
                      onChange={(e) => setCustomAllergen(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAllergen())}
                      placeholder="Ajouter un allergène personnalisé"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#a75120] focus:border-[#a75120] text-sm"
                    />
                    <button
                      type="button"
                      onClick={addCustomAllergen}
                      className="px-4 py-2 bg-[#a75120] text-white rounded-md hover:bg-[#8a421a] font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Liste des allergènes sélectionnés */}
                  {selectedAllergens.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedAllergens.map((allergen) => (
                        <span key={allergen} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                          {allergen}
                          <button
                            type="button"
                            onClick={() => removeAllergen(allergen)}
                            className="ml-1 text-red-600 hover:text-red-900 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showInCreations"
                      name="showInCreations"
                      checked={newProduct.showInCreations}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showInCreations" className="ml-2 block text-sm text-gray-700">
                      Afficher dans la galerie Créations
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showOnHome"
                      name="showOnHome"
                      checked={newProduct.showOnHome}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showOnHome" className="ml-2 block text-sm text-gray-700">
                      Afficher sur la page d&apos;accueil
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  Ajouter le produit
                </button>
              </form>
            </div>
          </div>
          
          {/* Liste des produits */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Produits existants</h2>
              
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600 mx-auto"></div>
                  <p className="mt-4 text-gray-700">Chargement des produits...</p>
                </div>
              ) : (
                <div className="w-full">
                  <table className="w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Image
                        </th>
                        <th scope="col" className="w-1/3 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nom
                        </th>
                        <th scope="col" className="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prix
                        </th>
                        <th scope="col" className="w-1/4 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Affichage
                        </th>
                        <th scope="col" className="w-32 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="px-2 py-4">
                            <div className="relative h-10 w-10 rounded overflow-hidden">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-2 py-4">
                            <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                            <div className="text-xs text-gray-500 truncate">{product.description.substring(0, 60)}...</div>
                          </td>
                          <td className="px-2 py-4">
                            <div className="text-sm text-gray-900">{product.price}</div>
                          </td>
                          <td className="px-2 py-4">
                            <div className="flex flex-col space-y-1">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${product.showInCreations ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {product.showInCreations ? 'Créations' : 'Non affiché'}
                              </span>
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${product.showOnHome ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                {product.showOnHome ? 'Accueil' : 'Non affiché en accueil'}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-4 text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setIsDetailsModalOpen(true);
                                }}
                                className="text-amber-600 hover:text-amber-900"
                              >
                                Détails
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {!isLoading && products.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Aucun produit disponible
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal de détails du produit */}
      {isDetailsModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Détails du produit</h2>
                <div className="flex space-x-4 items-center">
                  <button
                    onClick={() => {
                      if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
                        handleDeleteProduct(selectedProduct.id);
                        setIsDetailsModalOpen(false);
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Supprimer
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct({
                        ...selectedProduct,
                        showInCreations: !selectedProduct.showInCreations
                      });
                    }}
                    className={`text-sm font-medium ${
                      selectedProduct.showInCreations ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                    }`}
                  >
                    {selectedProduct.showInCreations ? 'Cacher des créations' : 'Afficher dans créations'}
                  </button>
                  <button
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du produit
                      </label>
                      <input
                        type="text"
                        value={selectedProduct.name}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prix
                      </label>
                      <input
                        type="text"
                        value={selectedProduct.price}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Portions
                      </label>
                      <input
                        type="text"
                        value={selectedProduct.portions || ''}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, portions: e.target.value })}
                        placeholder="ex: 12 mignardises"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse
                      </label>
                      <input
                        type="text"
                        value={selectedProduct.address || ''}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, address: e.target.value })}
                        placeholder="ex: 3 rue des prés du roi 64800 NAY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notice
                      </label>
                      <input
                        type="text"
                        value={selectedProduct.notice || ''}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, notice: e.target.value })}
                        placeholder="ex: Commandez 48h à l&apos;avance"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProduct.showInCreations}
                          onChange={(e) => setSelectedProduct({ ...selectedProduct, showInCreations: e.target.checked })}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                          id="detail-show-in-creations"
                        />
                        <label htmlFor="detail-show-in-creations" className="ml-2 block text-sm text-gray-700">
                          Afficher dans créations
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProduct.showOnHome}
                          onChange={(e) => setSelectedProduct({ ...selectedProduct, showOnHome: e.target.checked })}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                          id="detail-show-on-home"
                        />
                        <label htmlFor="detail-show-on-home" className="ml-2 block text-sm text-gray-700">
                          Afficher sur la page d&apos;accueil
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <div className="flex items-start space-x-4">
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={selectedProduct.image}
                        onChange={(e) => setSelectedProduct({ ...selectedProduct, image: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <div className="relative h-20 w-20 rounded overflow-hidden">
                        <Image
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={selectedProduct.description}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Options avancées</h3>
                  
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Images additionnelles
                      </label>
                      <div className="space-y-4">
                        <div className="bg-amber-50 p-3 rounded-md text-sm">
                          <p className="text-amber-700 mb-1">
                            Téléchargez des images supplémentaires depuis votre ordinateur.
                          </p>
                        </div>
                        
                        {/* Formulaire d'upload d'image additionnelle */}
                        <div className="border border-gray-200 rounded-md p-3">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Ajouter une nouvelle image</h4>
                          <div className="flex flex-col space-y-3">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  setAdditionalImagesFiles(prev => [...prev, file]);
                                }
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                            />
                            
                            {additionalImagesFiles.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-1">Images sélectionnées: {additionalImagesFiles.length}</p>
                                <div className="flex flex-wrap gap-2">
                                  {additionalImagesFiles.map((file, index) => (
                                    <div key={index} className="relative group">
                                      <div className="relative h-16 w-16 rounded overflow-hidden border border-gray-300">
                                        <Image
                                          src={URL.createObjectURL(file)}
                                          alt={`Image ${index + 1}`}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newFiles = [...additionalImagesFiles];
                                          newFiles.splice(index, 1);
                                          setAdditionalImagesFiles(newFiles);
                                        }}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Affichage et gestion des images existantes */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Images actuelles</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {(selectedProduct.images || [selectedProduct.image]).map((imageUrl, index) => (
                              <div key={index} className="relative group">
                                <div className="relative h-24 rounded overflow-hidden border border-gray-300">
                                  <Image
                                    src={imageUrl}
                                    alt={`Image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                {index > 0 && ( // Ne pas permettre de supprimer l'image principale
                                  <button
                                    onClick={() => {
                                      const updatedImages = [...(selectedProduct.images || [])];
                                      updatedImages.splice(index, 1);
                                      setSelectedProduct({
                                        ...selectedProduct,
                                        images: updatedImages.length > 0 ? updatedImages : [selectedProduct.image]
                                      });
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Supprimer l&apos;image"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                )}
                                {index === 0 && (
                                  <div className="absolute bottom-0 left-0 right-0 bg-amber-500 text-white text-xs text-center py-1">
                                    Image principale
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Option pour ajouter des URLs d'images directement */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Ou ajouter des URLs d&apos;images</h4>
                          <textarea
                            value={(selectedProduct.images || []).filter(url => url !== selectedProduct.image).join('\n')}
                            onChange={(e) => {
                              const additionalImages = e.target.value.split('\n').filter(url => url.trim() !== '');
                              const allImages = [selectedProduct.image, ...additionalImages];
                              setSelectedProduct({ ...selectedProduct, images: allImages });
                            }}
                            rows={3}
                            placeholder="Entrez une URL d&apos;image par ligne"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Note: L&apos;image principale est automatiquement incluse.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description détaillée (un paragraphe par ligne)
                      </label>
                      <textarea
                        value={(selectedProduct.descriptionArray || []).join('\n\n')}
                        onChange={(e) => {
                          const paragraphs = e.target.value.split('\n\n').filter(p => p.trim() !== '');
                          setSelectedProduct({ ...selectedProduct, descriptionArray: paragraphs });
                        }}
                        rows={5}
                        placeholder="Entrez un paragraphe par ligne, séparez chaque paragraphe par une ligne vide"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Séparez les paragraphes par une ligne vide pour une meilleure présentation.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Allergènes (un par ligne)
                      </label>
                      <textarea
                        value={(selectedProduct.allergens || []).join('\n')}
                        onChange={(e) => {
                          const allergensList = e.target.value.split('\n').filter(a => a.trim() !== '');
                          setSelectedProduct({ ...selectedProduct, allergens: allergensList });
                        }}
                        rows={4}
                        placeholder="ex: 🌰 les fruits à coque"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Conseil: Utilisez des émojis pour une meilleure visualisation. Un allergène par ligne.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setIsDetailsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        // Si le tableau d'images n'est pas défini ou est vide, mais qu'il y a une image principale,
                        // créer un tableau avec juste l'image principale
                        if ((!selectedProduct.images || selectedProduct.images.length === 0) && selectedProduct.image) {
                          selectedProduct.images = [selectedProduct.image];
                        }

                        // Si description detaillée est vide, créer un tableau avec la description simple
                        if ((!selectedProduct.descriptionArray || selectedProduct.descriptionArray.length === 0) && selectedProduct.description) {
                          selectedProduct.descriptionArray = [selectedProduct.description];
                        }

                        // S'assurer que tous les champs optionnels sont présents
                        const productToUpdate = {
                          ...selectedProduct,
                          portions: selectedProduct.portions || '',
                          address: selectedProduct.address || '',
                          images: selectedProduct.images || [selectedProduct.image],
                          descriptionArray: selectedProduct.descriptionArray || [selectedProduct.description],
                          allergens: selectedProduct.allergens || [],
                          notice: selectedProduct.notice || ''
                        };

                        const response = await fetch(`/api/products?id=${selectedProduct.id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(productToUpdate),
                        });

                        if (!response.ok) {
                          throw new Error('Erreur lors de la mise à jour du produit');
                        }

                        // Mettre à jour la liste des produits
                        setProducts(products.map(p => 
                          p.id === selectedProduct.id ? selectedProduct : p
                        ));

                        setSuccessMessage('Produit mis à jour avec succès !');
                        setIsDetailsModalOpen(false);
                      } catch {
                        setErrorMessage('Erreur lors de la mise à jour du produit');
                      }
                    }}
                    className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 