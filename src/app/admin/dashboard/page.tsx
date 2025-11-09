'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { onAuthStateChanged } from 'firebase/auth';
import RichTextEditor from '@/components/RichTextEditor';

// Type pour les catégories
interface Category {
  id: string;
  name: string;
  description?: string;
}

// Type pour les tailles prédéfinies
interface PredefinedSize {
  id: string;
  name: string;
  price: string;
  createdAt?: unknown;
}

// Type pour les produits
interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  showInCreations: boolean;
  showOnHome: boolean;
  isNew?: boolean; // Badge "Nouveauté" sur le produit
  category?: string; // ID de la catégorie (pour compatibilité)
  categories?: string[]; // IDs des catégories (nouveau système)
  portions?: string;
  address?: string;
  images?: string[];
  descriptionArray?: string[];
  allergens?: string[];
  notice?: string;
  flavors?: string[];
  sizes?: { name: string; price: string }[];
  flavorManagementType?: 'standard' | 'pack'; // Type de gestion des saveurs
}

// Type pour la configuration du contenu
interface ContentConfig {
  id: string;
  seasonalFlavorsImage: string;
  eventCard1Image: string;
  eventCard2Image: string;
  carteAccueil1Image: string;
  carteAccueil2Image: string;
  updatedAt?: unknown;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: '',
    image: '',
    description: '',
    showInCreations: true,
    showOnHome: true,
    isNew: false,
    category: '',
    flavorManagementType: 'standard'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCategoriesModal, setSelectedCategoriesModal] = useState<string[]>([]); // Pour la modal de modification
  const [isCreatingNewCategoryModal, setIsCreatingNewCategoryModal] = useState(false); // Pour la modal
  const [newCategoryNameModal, setNewCategoryNameModal] = useState(''); // Pour la modal
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [additionalImagesFiles, setAdditionalImagesFiles] = useState<File[]>([]);
  
  // États pour les tailles prédéfinies
  const [predefinedSizes, setPredefinedSizes] = useState<PredefinedSize[]>([]);
  const [newPredefinedSizeName, setNewPredefinedSizeName] = useState('');
  
  // États pour les images des cartes d'accueil
  const [carte1File, setCarte1File] = useState<File | null>(null);
  const [carte2File, setCarte2File] = useState<File | null>(null);
  const [carte1Preview, setCarte1Preview] = useState<string>('/images/carteacc1.avif');
  const [carte2Preview, setCarte2Preview] = useState<string>('/images/carteacc2.avif');
  const [isUploadingCartes, setIsUploadingCartes] = useState(false);
  
  // États pour la configuration du contenu
  const [, setContentConfig] = useState<ContentConfig>({
    id: 'main',
    seasonalFlavorsImage: '/images/saveursaisoncartel.avif',
    eventCard1Image: '/images/cardevenementiel.avif',
    eventCard2Image: '/images/cardevenementiel2.avif',
    carteAccueil1Image: '/images/carteacc1.avif',
    carteAccueil2Image: '/images/carteacc2.avif'
  });
  const [seasonalImageFile, setSeasonalImageFile] = useState<File | null>(null);
  const [seasonalImagePreview, setSeasonalImagePreview] = useState<string>('/images/saveursaisoncartel.avif');
  const [isUploadingSeasonalImage, setIsUploadingSeasonalImage] = useState(false);
  
  // États pour les images des cartes événementielles
  const [eventCard1File, setEventCard1File] = useState<File | null>(null);
  const [eventCard1Preview, setEventCard1Preview] = useState<string>('/images/cardevenementiel.avif');
  const [isUploadingEventCard1, setIsUploadingEventCard1] = useState(false);
  
  const [eventCard2File, setEventCard2File] = useState<File | null>(null);
  const [eventCard2Preview, setEventCard2Preview] = useState<string>('/images/cardevenementiel2.avif');
  const [isUploadingEventCard2, setIsUploadingEventCard2] = useState(false);

  // États pour les saveurs, tailles et allergènes
  const [flavors, setFlavors] = useState<string[]>([]);
  // const [currentFlavor, setCurrentFlavor] = useState(''); // Non utilisé
  const [sizes, setSizes] = useState<{ name: string; price: string }[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [customAllergen, setCustomAllergen] = useState('');
  const [customFlavor, setCustomFlavor] = useState('');
  
  // États pour les catégories
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // Pour la sélection multiple
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);

  // Portions disponibles
  const availableSizes = ['2', '4', '6', '8', '10', '12'];

  // Liste des allergènes disponibles
  const availableAllergens = [
    '🥛 le lactose',
    '🥚 l\'œuf',
    '🌱 le sésame',
    '🌾 le gluten',
    '🌰 les fruits à coque'
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
          // Charger les catégories
          fetchCategories();
          // Charger les tailles prédéfinies
          fetchPredefinedSizes();
          // Charger la configuration du contenu
          fetchContentConfig();
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

  // Fonction pour récupérer les catégories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  // Fonction pour récupérer la configuration du contenu
  const fetchContentConfig = async () => {
    try {
      const response = await fetch('/api/content-config');
      if (response.ok) {
        const config = await response.json();
        setContentConfig(config);
        setSeasonalImagePreview(config.seasonalFlavorsImage);
        setEventCard1Preview(config.eventCard1Image);
        setEventCard2Preview(config.eventCard2Image);
        setCarte1Preview(config.carteAccueil1Image);
        setCarte2Preview(config.carteAccueil2Image);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
    }
  };

  // Fonction pour récupérer les tailles prédéfinies
  const fetchPredefinedSizes = async () => {
    try {
      const response = await fetch('/api/predefined-sizes');
      
      if (response.ok) {
        const sizes = await response.json();
        setPredefinedSizes(sizes);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tailles prédéfinies:', error);
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

      const configUpdates: Partial<ContentConfig> = {};

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
          const errorData = await response1.json();
          throw new Error(errorData.error || 'Erreur lors de l\'upload de la carte 1');
        }

        const result1 = await response1.json();
        configUpdates.carteAccueil1Image = result1.imageUrl;
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
          const errorData = await response2.json();
          throw new Error(errorData.error || 'Erreur lors de l\'upload de la carte 2');
        }

        const result2 = await response2.json();
        configUpdates.carteAccueil2Image = result2.imageUrl;
      }

      // Mettre à jour la configuration dans Firebase
      if (Object.keys(configUpdates).length > 0) {
        const configResponse = await fetch('/api/content-config', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(configUpdates),
        });

        if (!configResponse.ok) {
          throw new Error('Erreur lors de la mise à jour de la configuration');
        }

        const updatedConfig = await configResponse.json();
        setContentConfig(updatedConfig);
        setCarte1Preview(updatedConfig.carteAccueil1Image);
        setCarte2Preview(updatedConfig.carteAccueil2Image);
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

  // Fonction pour gérer le changement d'image des saveurs de saison
  const handleSeasonalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSeasonalImageFile(file);
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setSeasonalImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour uploader l'image des saveurs de saison
  const uploadSeasonalImage = async () => {
    if (!seasonalImageFile) {
      setErrorMessage('Veuillez sélectionner une image');
      return;
    }

    try {
      setIsUploadingSeasonalImage(true);
      setErrorMessage('');
      setSuccessMessage('');

      const formData = new FormData();
      formData.append('file', seasonalImageFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du téléchargement de l\'image');
      }

      const responseData = await response.json();
      
      if (!responseData.imageUrl) {
        throw new Error('URL de l\'image non reçue du serveur');
      }

      // Mettre à jour la configuration du contenu
      const configPayload = {
        seasonalFlavorsImage: responseData.imageUrl
      };
      console.log('Envoi de la configuration:', configPayload);
      
      const configResponse = await fetch('/api/content-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configPayload),
      });

      if (!configResponse.ok) {
        throw new Error('Erreur lors de la mise à jour de la configuration');
      }

      const updatedConfig = await configResponse.json();
      setContentConfig(updatedConfig);
      setSeasonalImagePreview(updatedConfig.seasonalFlavorsImage);
      setSeasonalImageFile(null);
      
      setSuccessMessage('Image des saveurs de saison mise à jour avec succès !');
      
      // Recharger la page après 2 secondes
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Erreur lors de la mise à jour de l\'image');
    } finally {
      setIsUploadingSeasonalImage(false);
    }
  };

  // Fonctions pour gérer les images des cartes événementielles
  const handleEventCard1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEventCard1File(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventCard1Preview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventCard2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEventCard2File(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventCard2Preview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadEventCard1 = async () => {
    if (!eventCard1File) {
      setErrorMessage('Veuillez sélectionner une image');
      return;
    }

    try {
      setIsUploadingEventCard1(true);
      setErrorMessage('');
      setSuccessMessage('');

      const formData = new FormData();
      formData.append('file', eventCard1File);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du téléchargement de l\'image');
      }

      const responseData = await response.json();
      
      if (!responseData.imageUrl) {
        throw new Error('URL de l\'image non reçue du serveur');
      }

      const configPayload = {
        eventCard1Image: responseData.imageUrl
      };
      console.log('Envoi de la configuration (carte 1):', configPayload);
      
      const configResponse = await fetch('/api/content-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configPayload),
      });

      if (!configResponse.ok) {
        throw new Error('Erreur lors de la mise à jour de la configuration');
      }

      const updatedConfig = await configResponse.json();
      setContentConfig(updatedConfig);
      setEventCard1Preview(updatedConfig.eventCard1Image);
      setEventCard1File(null);
      
      setSuccessMessage('Image de la carte événementielle 1 mise à jour avec succès !');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Erreur lors de la mise à jour de l\'image');
    } finally {
      setIsUploadingEventCard1(false);
    }
  };

  const uploadEventCard2 = async () => {
    if (!eventCard2File) {
      setErrorMessage('Veuillez sélectionner une image');
      return;
    }

    try {
      setIsUploadingEventCard2(true);
      setErrorMessage('');
      setSuccessMessage('');

      const formData = new FormData();
      formData.append('file', eventCard2File);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du téléchargement de l\'image');
      }

      const responseData = await response.json();
      
      if (!responseData.imageUrl) {
        throw new Error('URL de l\'image non reçue du serveur');
      }

      const configPayload = {
        eventCard2Image: responseData.imageUrl
      };
      console.log('Envoi de la configuration (carte 2):', configPayload);
      
      const configResponse = await fetch('/api/content-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configPayload),
      });

      if (!configResponse.ok) {
        throw new Error('Erreur lors de la mise à jour de la configuration');
      }

      const updatedConfig = await configResponse.json();
      setContentConfig(updatedConfig);
      setEventCard2Preview(updatedConfig.eventCard2Image);
      setEventCard2File(null);
      
      setSuccessMessage('Image de la carte événementielle 2 mise à jour avec succès !');
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Erreur:', error);
      setErrorMessage('Erreur lors de la mise à jour de l\'image');
    } finally {
      setIsUploadingEventCard2(false);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: checked }));
  };

  // Gestion des saveurs

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

  // Gestion des catégories
  const createNewCategory = async () => {
    if (!newCategoryName.trim()) {
      setErrorMessage('Veuillez saisir un nom de catégorie');
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          createIfNotExists: true
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la catégorie');
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setSelectedCategory(newCategory.id);
      setNewCategoryName('');
      setIsCreatingNewCategory(false);
      setSuccessMessage(`Catégorie "${newCategory.name}" créée avec succès`);
    } catch (error) {
      setErrorMessage('Erreur lors de la création de la catégorie');
      console.error(error);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    if (!confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ?\n\nCette action supprimera la catégorie de tous les produits qui l'utilisent.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/categories?id=${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la catégorie');
      }

      // Supprimer la catégorie de la liste
      setCategories(categories.filter(c => c.id !== categoryId));
      
      // Supprimer la catégorie des sélections
      setSelectedCategories(selectedCategories.filter(c => c !== categoryId));
      setSelectedCategoriesModal(selectedCategoriesModal.filter(c => c !== categoryId));
      
      // Si c'était la catégorie sélectionnée, la désélectionner
      if (selectedCategory === categoryId) {
        setSelectedCategory('');
      }

      setSuccessMessage(`Catégorie "${category.name}" supprimée avec succès`);
    } catch (error) {
      setErrorMessage('Erreur lors de la suppression de la catégorie');
      console.error(error);
    }
  };

  // Gestion des tailles prédéfinies
  const createPredefinedSize = async () => {
    if (!newPredefinedSizeName.trim()) {
      setErrorMessage('Veuillez saisir un nom pour la taille');
      return;
    }

    try {
      const response = await fetch('/api/predefined-sizes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newPredefinedSizeName.trim(),
          price: '0' // Prix par défaut, sera modifié après
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la taille prédéfinie');
      }

      const newSize = await response.json();
      setPredefinedSizes([...predefinedSizes, newSize]);
      setNewPredefinedSizeName('');
      setNewPredefinedSizePrice('');
      setSuccessMessage(`Taille "${newSize.name}" créée avec succès. Vous pouvez maintenant définir son prix.`);
    } catch (error) {
      setErrorMessage('Erreur lors de la création de la taille prédéfinie');
      console.error(error);
    }
  };

  const deletePredefinedSize = async (sizeId: string) => {
    const size = predefinedSizes.find(s => s.id === sizeId);
    if (!size) return;

    if (!confirm(`Êtes-vous sûr de vouloir supprimer la taille "${size.name}" ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/predefined-sizes?id=${sizeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la taille');
      }

      setPredefinedSizes(predefinedSizes.filter(s => s.id !== sizeId));
      setSuccessMessage(`Taille "${size.name}" supprimée avec succès`);
    } catch (error) {
      setErrorMessage('Erreur lors de la suppression de la taille');
      console.error(error);
    }
  };

  const createNewCategoryModal = async () => {
    if (!newCategoryNameModal.trim()) {
      setErrorMessage('Veuillez saisir un nom de catégorie');
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newCategoryNameModal.trim(),
          createIfNotExists: true
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la catégorie');
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory]);
      setSelectedCategoriesModal([...selectedCategoriesModal, newCategory.id]);
      setNewCategoryNameModal('');
      setIsCreatingNewCategoryModal(false);
      setSuccessMessage(`Catégorie "${newCategory.name}" créée avec succès`);
    } catch (error) {
      setErrorMessage('Erreur lors de la création de la catégorie');
      console.error(error);
    }
  };

  // Supprimer une image existante dans la modal
  const removeExistingImage = (index: number) => {
    if (!selectedProduct) return;
    
    const updatedImages = [...(selectedProduct.images || [])];
    updatedImages.splice(index, 1);
    setSelectedProduct({
      ...selectedProduct,
      images: updatedImages
    });
  };



  // Gestion des catégories multiples
  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  // Gestion des catégories multiples dans la modal
  const toggleCategoryModal = (categoryId: string) => {
    if (selectedCategoriesModal.includes(categoryId)) {
      setSelectedCategoriesModal(selectedCategoriesModal.filter(c => c !== categoryId));
    } else {
      setSelectedCategoriesModal([...selectedCategoriesModal, categoryId]);
    }
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

  const addCustomFlavor = () => {
    if (customFlavor.trim() && !flavors.includes(customFlavor.trim())) {
      setFlavors([...flavors, customFlavor.trim()]);
      setCustomFlavor('');
    }
  };

  const addCustomFlavorForEdit = () => {
    if (customFlavor.trim() && selectedProduct && !(selectedProduct.flavors || []).includes(customFlavor.trim())) {
      setSelectedProduct({ 
        ...selectedProduct, 
        flavors: [...(selectedProduct.flavors || []), customFlavor.trim()] 
      });
      setCustomFlavor('');
    }
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
      setIsAddingProduct(false);
      return;
    }
    
    setIsAddingProduct(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    // Vérifier si une image a été sélectionnée
    if (!imageFile) {
      setErrorMessage('Veuillez sélectionner une image');
      setIsAddingProduct(false);
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
        allergens: selectedAllergens.length > 0 ? selectedAllergens : undefined,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined
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
        showOnHome: true,
        isNew: false
      });
      setImageFile(null);
      setImagePreview('');
      setAdditionalImages([]);
      setAdditionalImagesFiles([]);
      setFlavors([]);
      setSizes([]);
      setSelectedAllergens([]);
      setSelectedCategories([]);
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
    } finally {
      setIsAddingProduct(false);
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
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin/orders')}
              className="px-4 py-2 bg-[#a75120] text-white rounded-md hover:bg-[#8a421a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a75120] font-medium transition-colors"
            >
              Gestion des commandes
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Déconnexion
            </button>
          </div>
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

        {/* Section Image des Saveurs de Saison */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Image des Saveurs de Saison</h2>
          <p className="text-gray-600 mb-4">
            Gérez l&apos;image affichée dans la section &quot;Les racines du concept&quot; de la page des saveurs de saison.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aperçu de l'image actuelle */}
            <div>
              <h3 className="text-lg font-semibold text-[#a75120] mb-3">Image actuelle</h3>
              <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={seasonalImagePreview}
                  alt="Image des saveurs de saison"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            
            {/* Formulaire d'upload */}
            <div>
              <h3 className="text-lg font-semibold text-[#a75120] mb-3">Nouvelle image</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="seasonalImageFile"
                  accept="image/*"
                  onChange={handleSeasonalImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="seasonalImageFile"
                  className="cursor-pointer block"
                >
                  <div className="text-gray-500 mb-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600">
                    Cliquez pour sélectionner une image
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, JPEG jusqu&apos;à 10MB
                  </p>
                </label>
              </div>
              
              {seasonalImageFile && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Fichier sélectionné: {seasonalImageFile.name}
                  </p>
                  <button
                    onClick={uploadSeasonalImage}
                    disabled={isUploadingSeasonalImage}
                    className="w-full bg-[#a75120] hover:bg-[#8a421a] text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploadingSeasonalImage ? 'Mise à jour en cours...' : 'Mettre à jour l\'image'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section Images des Cartes Événementielles */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Images des Cartes Événementielles</h2>
          <p className="text-gray-600 mb-6">
            Gérez les images affichées dans la section &quot;Cartes Événementielles&quot; de la page événementiel.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Carte Événementielle 1 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#a75120]">Carte Événementielle 1</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Aperçu */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Image actuelle</h4>
                  <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={eventCard1Preview}
                      alt="Carte Événementielle 1"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                
                {/* Upload */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Nouvelle image</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      id="eventCard1File"
                      accept="image/*"
                      onChange={handleEventCard1Change}
                      className="hidden"
                    />
                    <label
                      htmlFor="eventCard1File"
                      className="cursor-pointer block"
                    >
                      <div className="text-gray-500 mb-2">
                        <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600">Cliquez pour sélectionner</p>
                    </label>
                  </div>
                  
                  {eventCard1File && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-2">
                        Fichier: {eventCard1File.name}
                      </p>
                      <button
                        onClick={uploadEventCard1}
                        disabled={isUploadingEventCard1}
                        className="w-full bg-[#a75120] hover:bg-[#8a421a] text-white font-medium py-2 px-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {isUploadingEventCard1 ? 'Mise à jour...' : 'Mettre à jour'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Carte Événementielle 2 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#a75120]">Carte des Saveurs de Saison</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Aperçu */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Image actuelle</h4>
                  <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={eventCard2Preview}
                      alt="Carte des Saveurs de Saison"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                
                {/* Upload */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Nouvelle image</h4>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      id="eventCard2File"
                      accept="image/*"
                      onChange={handleEventCard2Change}
                      className="hidden"
                    />
                    <label
                      htmlFor="eventCard2File"
                      className="cursor-pointer block"
                    >
                      <div className="text-gray-500 mb-2">
                        <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-600">Cliquez pour sélectionner</p>
                    </label>
                  </div>
                  
                  {eventCard2File && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-2">
                        Fichier: {eventCard2File.name}
                      </p>
                      <button
                        onClick={uploadEventCard2}
                        disabled={isUploadingEventCard2}
                        className="w-full bg-[#a75120] hover:bg-[#8a421a] text-white font-medium py-2 px-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {isUploadingEventCard2 ? 'Mise à jour...' : 'Mettre à jour'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
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

                {/* Catégories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégories
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Sélectionnez une ou plusieurs catégories pour ce produit
                  </p>
                  
                  {/* Catégories disponibles */}
                  {categories.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-md mb-3">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`category-${category.id}`}
                              checked={selectedCategories.includes(category.id)}
                              onChange={() => toggleCategory(category.id)}
                              className="h-4 w-4 text-[#a75120] focus:ring-[#a75120] border-gray-300 rounded"
                            />
                            <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-gray-700 cursor-pointer">
                              {category.name}
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteCategory(category.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title={`Supprimer la catégorie "${category.name}"`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic mb-3">Aucune catégorie disponible. Créez-en une ci-dessous.</p>
                  )}

                  {/* Créer une nouvelle catégorie */}
                  {!isCreatingNewCategory ? (
                    <button
                      type="button"
                      onClick={() => setIsCreatingNewCategory(true)}
                      className="text-sm text-[#a75120] hover:text-[#8a421a] font-medium"
                    >
                      + Nouvelle catégorie
                    </button>
                  ) : (
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), createNewCategory())}
                        placeholder="Nom de la nouvelle catégorie"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#a75120] focus:border-[#a75120] text-sm"
                      />
                      <button
                        type="button"
                        onClick={createNewCategory}
                        className="px-4 py-2 bg-[#a75120] text-white rounded-md hover:bg-[#8a421a] font-bold"
                      >
                        Créer
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingNewCategory(false);
                          setNewCategoryName('');
                        }}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                      >
                        Annuler
                      </button>
                    </div>
                  )}

                  {/* Liste des catégories sélectionnées */}
                  {selectedCategories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedCategories.map((categoryId) => {
                        const category = categories.find(c => c.id === categoryId);
                        return category ? (
                          <span key={categoryId} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                            {category.name}
                            <button
                              type="button"
                              onClick={() => toggleCategory(categoryId)}
                              className="ml-1 text-amber-600 hover:text-amber-900 font-bold"
                            >
                              ×
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
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
                    
                  </div>
                </div>
                
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md mb-2">
                    <p className="text-xs text-gray-600 mb-2">
                      <strong>Éditeur de texte riche :</strong> Utilisez les outils ci-dessous pour formater votre texte.
                    </p>
                    <p className="text-xs text-gray-500">
                      • <strong>Gras</strong>, <em>italique</em>, <u>souligné</u><br/>
                      • Couleurs et polices personnalisées<br/>
                      • Listes à puces et numérotées<br/>
                      • Liens et images
                    </p>
                  </div>
                  <RichTextEditor
                    value={newProduct.description}
                    onChange={(value) => setNewProduct({...newProduct, description: value})}
                    placeholder="Saisissez votre description ici... Vous pouvez utiliser tous les outils de formatage disponibles."
                    className="mb-2"
                  />
                </div>
                

                {/* Tailles et prix */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de parts (optionnel)
                  </label>
                  <p className="text-xs text-gray-500 mb-3">Cochez les portions disponibles et leurs prix (le client choisira UNE portion)</p>
                  <div className="space-y-2 bg-gray-50 p-3 rounded-md">
                    {/* Tailles standard (parts) */}
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
                                type="text"
                                value={existingSize.price}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Permettre seulement les chiffres et un point
                                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                    addOrUpdateSize(`${sizeNum} parts`, value);
                                  }
                                }}
                                placeholder="Prix"
                                className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-[#a75120] focus:border-[#a75120] text-sm"
                              />
                              <span className="text-sm text-gray-600">€</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Tailles prédéfinies */}
                    {predefinedSizes.map((predefinedSize) => {
                      const existingSize = sizes.find(s => s.name === predefinedSize.name);
                      return (
                        <div key={predefinedSize.id} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={`predefined-size-${predefinedSize.id}`}
                            checked={!!existingSize}
                            onChange={(e) => {
                              if (!e.target.checked) {
                                removeSize(predefinedSize.name);
                              } else {
                                setSizes([...sizes, { name: predefinedSize.name, price: '' }]);
                              }
                            }}
                            className="h-4 w-4 text-[#a75120] focus:ring-[#a75120] border-gray-300 rounded"
                          />
                          <label htmlFor={`predefined-size-${predefinedSize.id}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                            {predefinedSize.name}
                          </label>
                          {existingSize && (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={existingSize.price}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Permettre seulement les chiffres et un point
                                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                    addOrUpdateSize(predefinedSize.name, value);
                                  }
                                }}
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


                  {/* Gestion des tailles prédéfinies */}
                  {predefinedSizes.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                      <p className="text-sm font-medium text-blue-700 mb-2">Gérer les tailles prédéfinies</p>
                      <div className="space-y-1">
                        {predefinedSizes.map((size) => (
                          <div key={size.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{size.name}</span>
                            <button
                              type="button"
                              onClick={() => deletePredefinedSize(size.id)}
                              className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                              title={`Supprimer "${size.name}"`}
                            >
                              Supprimer
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ajout de nouvelle taille prédéfinie */}
                  <div className="mt-4 p-3 bg-amber-50 rounded-md border border-amber-200">
                    <p className="text-sm font-medium text-amber-700 mb-2">Ajouter une nouvelle taille personnalisée</p>
                    <p className="text-xs text-gray-600 mb-3">Créez la taille, puis définissez son prix dans la liste ci-dessous</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newPredefinedSizeName}
                        onChange={(e) => setNewPredefinedSizeName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && createPredefinedSize()}
                        placeholder="ex: 12 pièces mignardises"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#a75120] focus:border-[#a75120]"
                      />
                      <button
                        type="button"
                        onClick={createPredefinedSize}
                        className="px-4 py-2 bg-[#a75120] text-white rounded-md hover:bg-[#8a421a] font-medium"
                      >
                        Créer
                      </button>
                    </div>
                  </div>

                  {sizes.length > 0 && (
                    <div className="mt-3 p-2 bg-[#f8f3eb] rounded-md border border-[#a75120]/30">
                      <p className="text-xs font-semibold text-[#421500] mb-1">Portions proposées :</p>
                      {sizes.map((size) => (
                        <div key={size.name} className="flex items-center justify-between text-xs text-[#421500]">
                          <span>• {size.name} : {size.price || '(prix manquant)'}€</span>
                          <button
                            type="button"
                            onClick={() => removeSize(size.name)}
                            className="ml-2 text-red-600 hover:text-red-800 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Allergènes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Allergènes (optionnel)
                  </label>
                  
                  <div>
                    <>
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
                    </>
                  </div>
                </div>

                {/* Type de gestion des saveurs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de gestion des saveurs
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="flavorManagementType"
                        value="standard"
                        checked={newProduct.flavorManagementType === 'standard'}
                        onChange={(e) => setNewProduct({...newProduct, flavorManagementType: e.target.value as 'standard' | 'pack'})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Standard (une saveur par ajout)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="flavorManagementType"
                        value="pack"
                        checked={newProduct.flavorManagementType === 'pack'}
                        onChange={(e) => setNewProduct({...newProduct, flavorManagementType: e.target.value as 'standard' | 'pack'})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Pack de saveurs (plusieurs saveurs par pack)</span>
                    </label>
                  </div>
                </div>

                {/* Saveurs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saveurs (optionnel)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={customFlavor}
                      onChange={(e) => setCustomFlavor(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFlavor())}
                      placeholder="Ex: Chocolat Passion"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={addCustomFlavor}
                      className="px-4 py-2 bg-[#a75120] text-white rounded-md hover:bg-[#8a421a]"
                    >
                      Ajouter
                    </button>
                  </div>
                  
                  {flavors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {flavors.map((flavor, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#a75120]/10 text-[#a75120] border border-[#a75120]/20"
                        >
                          {flavor}
                          <button
                            type="button"
                            onClick={() => setFlavors(flavors.filter((_, i) => i !== index))}
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
                      id="isNew"
                      name="isNew"
                      checked={newProduct.isNew || false}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isNew" className="ml-2 block text-sm text-gray-700">
                      Afficher le badge &quot;Nouveauté&quot;
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isAddingProduct}
                  className={`w-full font-bold py-2 px-4 rounded-md transition-colors ${
                    isAddingProduct 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-amber-600 hover:bg-amber-700'
                  } text-white`}
                >
                  {isAddingProduct ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Ajout en cours...
                    </div>
                  ) : (
                    'Ajouter le produit'
                  )}
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
                  {/* Version desktop - Tableau */}
                  <div className="hidden md:block">
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
                              </div>
                            </td>
                            <td className="px-2 py-4 text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    // S'assurer que la description et les tailles sont correctement formatées
                                    const productWithFormattedDescription = {
                                      ...product,
                                      descriptionArray: product.descriptionArray || (product.description ? product.description.split('\n') : []),
                                      sizes: product.sizes || [],
                                      flavorManagementType: product.flavorManagementType || 'standard'
                                    };
                                    setSelectedProduct(productWithFormattedDescription);
                                    // Initialiser les catégories sélectionnées pour la modal
                                    setSelectedCategoriesModal(product.categories || (product.category ? [product.category] : []));
                                    setIsDetailsModalOpen(true);
                                  }}
                                  className="text-amber-600 hover:text-amber-900"
                                >
                                  Modifier
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

                  {/* Version mobile - Cartes */}
                  <div className="md:hidden space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start space-x-3">
                          {/* Image */}
                          <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                            
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">{product.price}</span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.showInCreations ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {product.showInCreations ? 'Créations' : 'Non affiché'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="mt-3 flex space-x-3">
                              <button
                                onClick={() => {
                                  const productWithFormattedDescription = {
                                    ...product,
                                    descriptionArray: product.descriptionArray || (product.description ? product.description.split('\n') : []),
                                    sizes: product.sizes || [],
                                    flavorManagementType: product.flavorManagementType || 'standard'
                                  };
                                  setSelectedProduct(productWithFormattedDescription);
                                  setSelectedCategoriesModal(product.categories || (product.category ? [product.category] : []));
                                  setIsDetailsModalOpen(true);
                                }}
                                className="flex-1 bg-[#a75120] text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-[#8a421a] transition-colors"
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="flex-1 bg-red-600 text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-red-700 transition-colors"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      setIsCreatingNewCategoryModal(false);
                      setNewCategoryNameModal('');
                    }}
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

                    {/* Section Catégories dans le modal d'édition */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Catégories
                      </label>
                      <p className="text-xs text-gray-500 mb-3">
                        Sélectionnez une ou plusieurs catégories pour ce produit
                      </p>
                      
                      {/* Catégories disponibles */}
                      {categories.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-md mb-3">
                          {categories.map((category) => (
                            <div key={category.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`modal-category-${category.id}`}
                                checked={selectedCategoriesModal.includes(category.id)}
                                onChange={() => toggleCategoryModal(category.id)}
                                className="h-4 w-4 text-[#a75120] focus:ring-[#a75120] border-gray-300 rounded"
                              />
                              <label htmlFor={`modal-category-${category.id}`} className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic mb-3">Aucune catégorie disponible.</p>
                      )}

                      {/* Créer une nouvelle catégorie dans la modal */}
                      {!isCreatingNewCategoryModal ? (
                        <button
                          type="button"
                          onClick={() => setIsCreatingNewCategoryModal(true)}
                          className="text-sm text-[#a75120] hover:text-[#8a421a] font-medium mb-3"
                        >
                          + Nouvelle catégorie
                        </button>
                      ) : (
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newCategoryNameModal}
                            onChange={(e) => setNewCategoryNameModal(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), createNewCategoryModal())}
                            placeholder="Nom de la nouvelle catégorie"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#a75120] focus:border-[#a75120] text-sm"
                          />
                          <button
                            type="button"
                            onClick={createNewCategoryModal}
                            className="px-4 py-2 bg-[#a75120] text-white rounded-md hover:bg-[#8a421a] font-bold"
                          >
                            Créer
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreatingNewCategoryModal(false);
                              setNewCategoryNameModal('');
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                          >
                            Annuler
                          </button>
                        </div>
                      )}

                      {/* Liste des catégories sélectionnées */}
                      {selectedCategoriesModal.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedCategoriesModal.map((categoryId) => {
                            const category = categories.find(c => c.id === categoryId);
                            return category ? (
                              <span key={categoryId} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                                {category.name}
                                <button
                                  type="button"
                                  onClick={() => toggleCategoryModal(categoryId)}
                                  className="ml-1 text-amber-600 hover:text-amber-900 font-bold"
                                >
                                  ×
                                </button>
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
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

                    {/* Tailles et prix */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de parts (optionnel)
                      </label>
                      <div className="space-y-3">
                        {(selectedProduct.sizes || []).map((size, index) => (
                          <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                              value={size.name}
                              onChange={(e) => {
                                const newSizes = [...(selectedProduct.sizes || [])];
                                newSizes[index] = { ...newSizes[index], name: e.target.value };
                                setSelectedProduct({ ...selectedProduct, sizes: newSizes });
                              }}
                              placeholder="ex: 12 mignardises"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                            />
                      <input
                        type="text"
                              value={size.price}
                              onChange={(e) => {
                                const newSizes = [...(selectedProduct.sizes || [])];
                                newSizes[index] = { ...newSizes[index], price: e.target.value };
                                setSelectedProduct({ ...selectedProduct, sizes: newSizes });
                              }}
                              placeholder="Prix (€)"
                              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newSizes = [...(selectedProduct.sizes || [])];
                                newSizes.splice(index, 1);
                                setSelectedProduct({ ...selectedProduct, sizes: newSizes });
                              }}
                              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                              ×
                            </button>
                    </div>
                        ))}
                        
                        {/* Tailles prédéfinies dans la modal */}
                        {predefinedSizes.length > 0 && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                            <p className="text-sm font-medium text-blue-700 mb-2">Tailles prédéfinies disponibles</p>
                            <div className="grid grid-cols-1 gap-2">
                              {predefinedSizes.map((size) => (
                                <div key={size.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-700">{size.name} - {size.price} €</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const existingSize = (selectedProduct.sizes || []).find(s => s.name === size.name);
                                        if (!existingSize) {
                                          const newSizes = [...(selectedProduct.sizes || []), { name: size.name, price: size.price }];
                                          setSelectedProduct({ ...selectedProduct, sizes: newSizes });
                                        }
                                      }}
                                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                    >
                                      Ajouter
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => {
                            const newSizes = [...(selectedProduct.sizes || []), { name: '', price: '' }];
                            setSelectedProduct({ ...selectedProduct, sizes: newSizes });
                          }}
                          className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                        >
                          Ajouter une taille manuelle
                        </button>
                        
                        {(selectedProduct.sizes || []).length > 0 && (
                          <div className="mt-3 p-2 bg-amber-50 rounded-md border border-amber-200">
                            <p className="text-xs font-semibold text-amber-700 mb-1">Tailles proposées :</p>
                            {(selectedProduct.sizes || []).map((size, index) => (
                              <div key={index} className="text-xs text-amber-700">
                                • {size.name} : {size.price || '(prix manquant)'}€
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="space-y-4">

                    <div className="grid grid-cols-1 gap-4">
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
                          checked={selectedProduct.isNew || false}
                          onChange={(e) => setSelectedProduct({ ...selectedProduct, isNew: e.target.checked })}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                          id="detail-is-new"
                        />
                        <label htmlFor="detail-is-new" className="ml-2 block text-sm text-gray-700">
                          Afficher le badge &quot;Nouveauté&quot;
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image principale */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image principale
                  </label>
                  <div className="bg-amber-50 p-3 rounded-md text-sm mb-3">
                    <p className="text-amber-700 mb-1">
                      Téléchargez l&apos;image principale depuis votre ordinateur.
                    </p>
                  </div>
                  
                  {/* Formulaire d'upload d'image principale */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const formData = new FormData();
                          formData.append('file', file);
                          
                          try {
                            const response = await fetch('/api/upload', {
                              method: 'POST',
                              body: formData,
                            });
                            
                            if (response.ok) {
                              const data = await response.json();
                              setSelectedProduct({ ...selectedProduct, image: data.imageUrl });
                            } else {
                              console.error('Erreur lors de l\'upload');
                            }
                          } catch (error) {
                            console.error('Erreur:', error);
                          }
                        }
                      }}
                      className="hidden"
                      id="main-image-upload"
                    />
                    <label
                      htmlFor="main-image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-sm text-gray-600">Cliquez pour télécharger l&apos;image principale</span>
                    </label>
                    </div>
                  
                  {/* Aperçu de l'image principale */}
                  {selectedProduct.image && (
                    <div className="mt-3">
                      <div className="relative h-32 w-32 rounded overflow-hidden border border-gray-300">
                        <Image
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => selectedProduct && setSelectedProduct({ ...selectedProduct, image: '' })}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                
                {/* Images additionnelles */}
                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                        Images additionnelles
                      </label>
                  <div className="bg-amber-50 p-3 rounded-md text-sm mb-3">
                          <p className="text-amber-700 mb-1">
                            Téléchargez des images supplémentaires depuis votre ordinateur.
                          </p>
                        </div>
                        
                        {/* Formulaire d'upload d'images additionnelles (multiple) */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          try {
                            // Upload chaque fichier
                            const uploadPromises = files.map(async (file) => {
                              try {
                                const formData = new FormData();
                                formData.append('file', file);
                                
                                const response = await fetch('/api/upload', {
                                  method: 'POST',
                                  body: formData,
                                });
                                
                                if (response.ok) {
                                  const data = await response.json();
                                  console.log('Upload réussi pour:', file.name, 'URL:', data.imageUrl);
                                  return data.imageUrl;
                                } else {
                                  console.error('Erreur lors de l\'upload pour:', file.name);
                                  return null;
                                }
                              } catch (error) {
                                console.error('Erreur lors de l\'upload pour:', file.name, error);
                                return null;
                              }
                            });
                            
                            const uploadedUrls = await Promise.all(uploadPromises);
                            const validUrls = uploadedUrls.filter(url => url !== null && url !== undefined);
                            console.log('URLs uploadées avec succès:', validUrls);
                            
                            if (validUrls.length > 0) {
                              const currentImages = (selectedProduct.images || []).filter(img => img && img !== undefined);
                              setSelectedProduct({ 
                                ...selectedProduct, 
                                images: [...currentImages, ...validUrls] 
                              });
                            }
                          } catch (error) {
                            console.error('Erreur:', error);
                          }
                        }
                      }}
                      className="hidden"
                      id="additional-image-upload"
                    />
                    <label
                      htmlFor="additional-image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                      <span className="text-sm text-gray-600">Cliquez pour ajouter des images supplémentaires (plusieurs à la fois)</span>
                    </label>
                        </div>
                        
                  {/* Affichage des images additionnelles */}
                  {(() => {
                    const allImages = (selectedProduct.images || []).filter(img => img && img !== undefined && typeof img === 'string' && img.trim() !== '');
                    return allImages.length > 0;
                  })() && (
                    <div className="mt-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {(selectedProduct.images || []).filter(img => img && img !== undefined && typeof img === 'string' && img.trim() !== '').map((imageUrl, index) => (
                              <div key={index} className="relative group">
                                <div className="relative h-24 rounded overflow-hidden border border-gray-300">
                                  <Image
                                    src={imageUrl}
                                    alt={`Image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                  <button
                              type="button"
                                    onClick={() => removeExistingImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                  >
                              ×
                                  </button>
                              </div>
                            ))}
                          </div>
                        </div>
                  )}
                        </div>
                {/* Description détaillée */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description détaillée
                      </label>
                      <div className="bg-gray-50 p-3 rounded-md mb-2">
                        <p className="text-xs text-gray-600 mb-2">
                          <strong>Éditeur de texte riche :</strong> Utilisez les outils ci-dessous pour formater votre texte.
                        </p>
                        <p className="text-xs text-gray-500">
                          • <strong>Gras</strong>, <em>italique</em>, <u>souligné</u><br/>
                          • Couleurs et polices personnalisées<br/>
                          • Listes à puces et numérotées<br/>
                          • Liens et images
                        </p>
                      </div>
                      <RichTextEditor
                        value={selectedProduct.description || ''}
                        onChange={(value) => {
                          // Sauvegarder directement le HTML
                          setSelectedProduct({ ...selectedProduct, description: value });
                        }}
                        placeholder="Saisissez votre description ici... Vous pouvez utiliser tous les outils de formatage disponibles."
                        className="mb-2"
                      />
                    </div>

                {/* Allergènes */}
                    <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergènes
                      </label>
                  <div className="grid grid-cols-1 gap-2 mb-3">
                    {availableAllergens.map((allergen) => (
                      <div key={allergen} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`edit-allergen-${allergen}`}
                          checked={(selectedProduct.allergens || []).includes(allergen)}
                          onChange={() => {
                            const currentAllergens = selectedProduct.allergens || [];
                            if (currentAllergens.includes(allergen)) {
                              setSelectedProduct({ 
                                ...selectedProduct, 
                                allergens: currentAllergens.filter(a => a !== allergen) 
                              });
                            } else {
                              setSelectedProduct({ 
                                ...selectedProduct, 
                                allergens: [...currentAllergens, allergen] 
                              });
                            }
                          }}
                          className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`edit-allergen-${allergen}`} className="ml-2 block text-sm text-gray-700">
                          {allergen}
                        </label>
                    </div>
                    ))}
                  </div>
                  
                  {/* Allergène personnalisé */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customAllergen}
                      onChange={(e) => setCustomAllergen(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAllergen())}
                      placeholder="Allergène personnalisé"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={addCustomAllergen}
                      className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                    >
                      Ajouter
                    </button>
                </div>

                  {/* Allergènes sélectionnés */}
                  {(selectedProduct.allergens || []).length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Allergènes sélectionnés :</p>
                      <div className="flex flex-wrap gap-2">
                        {(selectedProduct.allergens || []).map((allergen) => (
                          <span key={allergen} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                            {allergen}
                  <button
                              type="button"
                              onClick={() => {
                                const currentAllergens = selectedProduct.allergens || [];
                                setSelectedProduct({ 
                                  ...selectedProduct, 
                                  allergens: currentAllergens.filter(a => a !== allergen) 
                                });
                              }}
                              className="ml-1 text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Type de gestion des saveurs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de gestion des saveurs
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editFlavorManagementType"
                        value="standard"
                        checked={selectedProduct.flavorManagementType === 'standard'}
                        onChange={(e) => setSelectedProduct({...selectedProduct, flavorManagementType: e.target.value as 'standard' | 'pack'})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Standard (une saveur par ajout)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editFlavorManagementType"
                        value="pack"
                        checked={selectedProduct.flavorManagementType === 'pack'}
                        onChange={(e) => setSelectedProduct({...selectedProduct, flavorManagementType: e.target.value as 'standard' | 'pack'})}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Pack de saveurs (plusieurs saveurs par pack)</span>
                    </label>
                  </div>
                </div>

                {/* Saveurs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saveurs (optionnel)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={customFlavor}
                      onChange={(e) => setCustomFlavor(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFlavorForEdit())}
                      placeholder="Ex: Chocolat Passion"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={addCustomFlavorForEdit}
                      className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
                    >
                      Ajouter
                    </button>
                  </div>
                  
                  {/* Liste des saveurs */}
                  {(selectedProduct.flavors || []).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(selectedProduct.flavors || []).map((flavor) => (
                        <span key={flavor} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {flavor}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedFlavors = (selectedProduct.flavors || []).filter(f => f !== flavor);
                              setSelectedProduct({ ...selectedProduct, flavors: updatedFlavors });
                            }}
                            className="ml-1 text-green-600 hover:text-green-900 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      setIsCreatingNewCategoryModal(false);
                      setNewCategoryNameModal('');
                    }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                  type="button"
                    onClick={async () => {
                      try {
                        const productToUpdate = {
                          ...selectedProduct,
                          portions: selectedProduct.portions || '',
                          images: selectedProduct.images || [selectedProduct.image],
                          descriptionArray: selectedProduct.descriptionArray || [selectedProduct.description],
                          allergens: selectedProduct.allergens || [],
                          flavors: selectedProduct.flavors || [],
                          categories: selectedCategoriesModal.length > 0 ? selectedCategoriesModal : undefined,
                        sizes: selectedProduct.sizes || []
                        };

                        const response = await fetch(`/api/products?id=${selectedProduct.id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(productToUpdate),
                        });

                      if (response.ok) {
                        // Rafraîchir la liste des produits
                        fetchProducts();
                        setIsDetailsModalOpen(false);
                        setSelectedProduct(null);
                      } else {
                        console.error('Erreur lors de la mise à jour du produit');
                      }
                    } catch (error) {
                      console.error('Erreur:', error);
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
      )}
    </div>
  );
} 
