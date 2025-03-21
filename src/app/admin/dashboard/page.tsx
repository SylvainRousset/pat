'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

// Type pour les produits
interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  showInShop: boolean;
  showOnHome: boolean;
  portions?: string;
  address?: string;
  images?: string[];
  descriptionArray?: string[];
  allergens?: string[];
  notice?: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: '',
    image: '',
    description: '',
    showInShop: true,
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

  // Vérifier l'authentification et charger les produits au chargement de la page
  useEffect(() => {
    // Utiliser une référence pour suivre si la vérification a déjà été effectuée
    const hasCheckedRef = { current: false };
    
    const checkAuth = () => {
      // Éviter les vérifications multiples
      if (hasCheckedRef.current) return;
      
      console.log("Vérification de l'authentification...");
      // Utiliser Firebase Auth pour vérifier l'authentification
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("Utilisateur authentifié:", user.email);
          setIsAuthenticated(true);
          hasCheckedRef.current = true;
          
          // Tester une seule fois l'API
          testApi().then(apiWorks => {
            if (apiWorks) {
              fetchProducts();
            }
          });
        } else {
          console.log("Utilisateur non authentifié, redirection vers page de connexion");
          setIsAuthenticated(false);
          
          // Rediriger vers la page de connexion
          window.location.href = '/admin';
        }
      });
      
      // Nettoyer l'abonnement lors du démontage du composant
      return () => unsubscribe();
    };
    
    checkAuth();
  }, []);

  // Fonction pour tester l'API
  const testApi = async () => {
    try {
      console.log("Test de l'API...");
      // Ajouter un timestamp pour éviter la mise en cache
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/check?_=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }
      const data = await response.json();
      console.log("Résultat du test API:", data);
      return true;
    } catch (error) {
      console.error("Erreur lors du test de l'API:", error);
      setErrorMessage(`Erreur de connexion à l'API. Veuillez vérifier la connexion internet ou contacter l'administrateur.`);
      return false;
    }
  };

  // Fonction pour récupérer les produits
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      console.log("Récupération des produits...");
      
      // Ajouter un timeout pour éviter les requêtes qui restent en attente
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout
      
      const response = await fetch('/api/products', {
        signal: controller.signal,
        // Ajout du cache: 'no-store' pour éviter les problèmes de cache
        cache: 'no-store'
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`${data.length} produits récupérés`);
      setProducts(data);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
      setErrorMessage(`Erreur lors du chargement des produits: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      // Définir products comme un tableau vide pour éviter une boucle infinie d'erreurs
      setProducts([]);
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: checked }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Déconnexion réussie, redirection vers la page de connexion");
      
      // Rediriger vers la page de connexion
      window.location.href = '/admin';
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      setErrorMessage('Erreur lors de la déconnexion');
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
    if (!imageFile && !newProduct.image) {
      setErrorMessage('Veuillez sélectionner une image');
      return;
    }
    
    try {
      setErrorMessage('');
      setSuccessMessage('Traitement en cours...');
      
      // Si nous avons un fichier image, nous le téléchargeons d'abord
      let imagePath = newProduct.image;
      const additionalImagePaths: string[] = [...additionalImages];
      
      if (imageFile) {
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
        images: [imagePath, ...additionalImagePaths]
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
        showInShop: true,
        showOnHome: true
      });
      setImageFile(null);
      setImagePreview('');
      setAdditionalImages([]);
      setAdditionalImagesFiles([]);
      
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
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression du produit');
      }
      
      // Mettre à jour la liste des produits
      setProducts(prev => prev.filter(product => product.id !== id));
      
      // Afficher un message de succès
      setSuccessMessage('Produit supprimé avec succès !');
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage((error as Error).message || 'Erreur lors de la suppression du produit');
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return null; // Ne rien afficher pendant la vérification/redirection
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f8f5f0] py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
            <button
              onClick={handleLogout}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Déconnexion
            </button>
          </div>
          
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
                      <div className="bg-amber-50 p-3 rounded-md mb-2 text-sm">
                        <p className="font-medium text-amber-800 mb-1">Note importante :</p>
                        <p className="text-amber-700 mb-1">
                          Vous pouvez télécharger des images depuis votre ordinateur ou entrer des URLs d&apos;images.
                        </p>
                      </div>
                      <input
                        type="file"
                        id="imageFile"
                        name="imageFile"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                      />
                      <input
                        type="text"
                        id="image"
                        name="image"
                        value={newProduct.image}
                        onChange={handleInputChange}
                        placeholder="ou entrez l&apos;URL de l&apos;image principale"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
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
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showInShop"
                        name="showInShop"
                        checked={newProduct.showInShop}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <label htmlFor="showInShop" className="ml-2 block text-sm text-gray-700">
                        Afficher dans la boutique
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
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${product.showInShop ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {product.showInShop ? 'Boutique' : 'Non affiché en boutique'}
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
                        showInShop: !selectedProduct.showInShop
                      });
                    }}
                    className={`text-sm font-medium ${
                      selectedProduct.showInShop ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                    }`}
                  >
                    {selectedProduct.showInShop ? 'Cacher de la boutique' : 'Afficher dans la boutique'}
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
                          checked={selectedProduct.showInShop}
                          onChange={(e) => setSelectedProduct({ ...selectedProduct, showInShop: e.target.checked })}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                          id="detail-show-in-shop"
                        />
                        <label htmlFor="detail-show-in-shop" className="ml-2 block text-sm text-gray-700">
                          Afficher dans la boutique
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
                            Vous pouvez ajouter des images supplémentaires en téléchargeant des fichiers ou en entrant des URLs.
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
    </>
  );
} 