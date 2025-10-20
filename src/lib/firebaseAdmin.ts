import { db, storage } from './firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  setDoc,
  deleteDoc, 
  doc, 
  query, 
  where,
  serverTimestamp,
  Query,
  DocumentData
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

// Type pour le timestamp Firebase
interface FirebaseTimestamp {
  toDate: () => Date;
  seconds: number;
  nanoseconds: number;
}

// Interface pour les catégories
export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: FirebaseTimestamp;
  updatedAt?: FirebaseTimestamp;
}

// Interface pour les produits
export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  showInCreations: boolean;
  showOnHome: boolean;
  category?: string; // ID de la catégorie
  createdAt?: FirebaseTimestamp;
  updatedAt?: FirebaseTimestamp;
  portions?: string;
  address?: string;
  images?: string[];
  descriptionArray?: string[];
  allergens?: string[];
  notice?: string;
  flavors?: string[];
  sizes?: { name: string; price: string }[];
  flavorManagementType?: 'standard' | 'pack'; // Type de gestion des saveurs
  [key: string]: unknown;
}

// Collections
const productsCollection = collection(db, 'products');
const categoriesCollection = collection(db, 'categories');

// Récupérer tous les produits
export const getAllProducts = async () => {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};

// Récupérer les produits filtrés
export const getFilteredProducts = async (filters: { showInCreations?: boolean, showOnHome?: boolean }) => {
  let q: Query<DocumentData, DocumentData> = productsCollection;
  
  if (filters.showInCreations !== undefined || filters.showOnHome !== undefined) {
    const conditions = [];
    
    if (filters.showInCreations !== undefined) {
      conditions.push(where('showInCreations', '==', filters.showInCreations));
    }
    
    if (filters.showOnHome !== undefined) {
      conditions.push(where('showOnHome', '==', filters.showOnHome));
    }
    
    q = query(productsCollection, ...conditions);
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};

// Obtenir un produit par son ID
export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Product;
  } catch (error) {
    console.error('Erreur lors de la récupération du produit par ID:', error);
    return null;
  }
};

// Ajouter un nouveau produit
export const addProduct = async (product: Omit<Product, 'id'>) => {
  const docRef = await addDoc(productsCollection, {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return {
    id: docRef.id,
    ...product
  };
};

// Mettre à jour un produit
export const updateProduct = async (id: string, product: Partial<Product>) => {
  const docRef = doc(db, 'products', id);
  await updateDoc(docRef, {
    ...product,
    updatedAt: serverTimestamp()
  });
  
  return {
    id,
    ...product
  };
};

// Supprimer un produit
export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return false;
  }
};

// ===== FONCTIONS POUR LES CATÉGORIES =====

// Récupérer toutes les catégories
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const snapshot = await getDocs(categoriesCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }
};

// Récupérer une catégorie par ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const docRef = doc(db, 'categories', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Category;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    return null;
  }
};

// Récupérer une catégorie par nom
export const getCategoryByName = async (name: string): Promise<Category | null> => {
  try {
    const q = query(categoriesCollection, where('name', '==', name));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as Category;
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la recherche de catégorie par nom:', error);
    return null;
  }
};

// Créer une nouvelle catégorie
export const addCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const docRef = await addDoc(categoriesCollection, {
    ...category,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return {
    id: docRef.id,
    ...category
  };
};

// Créer ou récupérer une catégorie par nom
export const createOrGetCategory = async (name: string): Promise<Category> => {
  // Vérifier si la catégorie existe déjà
  const existingCategory = await getCategoryByName(name);
  
  if (existingCategory) {
    return existingCategory;
  }
  
  // Créer une nouvelle catégorie
  return await addCategory({ name });
};

// Mettre à jour une catégorie
export const updateCategory = async (id: string, category: Partial<Category>): Promise<Category> => {
  const docRef = doc(db, 'categories', id);
  await updateDoc(docRef, {
    ...category,
    updatedAt: serverTimestamp()
  });
  
  return {
    id,
    ...category
  } as Category;
};

// Supprimer une catégorie
export const deleteCategory = async (categoryId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'categories', categoryId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    return false;
  }
};

// Télécharger une image
export const uploadProductImage = async (file: File) => {
  try {
    console.log('Simulation de téléchargement d&apos;image:', file.name);
    
    // Au lieu d'utiliser Firebase Storage, nous allons simplement retourner un chemin local
    // Cela suppose que les images sont déjà disponibles dans le dossier public/images
    
    // Nous gardons le nom du fichier original
    const fileName = file.name;
    
    // Simuler un délai pour l'upload
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retourner un chemin local vers le dossier public/images
    const imagePath = `/images/${fileName}`;
    console.log('Chemin d&apos;image simulé:', imagePath);
    
    return imagePath;
  } catch (error) {
    console.error('Erreur lors de la simulation de téléchargement d&apos;image:', error);
    throw new Error(`Erreur lors du téléchargement de l&apos;image: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

// Supprimer une image
export const deleteProductImage = async (imageUrl: string) => {
  // Extraire le chemin de l'URL
  const storageRef = ref(storage, imageUrl);
  await deleteObject(storageRef);
  return { success: true };
};

// Interface pour la configuration du contenu
export interface ContentConfig {
  id: string;
  seasonalFlavorsImage: string;
  eventCard1Image: string;
  eventCard2Image: string;
  carteAccueil1Image: string;
  carteAccueil2Image: string;
  updatedAt?: FirebaseTimestamp;
}

// Fonctions pour la configuration du contenu
export const getContentConfig = async (): Promise<ContentConfig | null> => {
  try {
    const configRef = doc(db, 'contentConfig', 'main');
    const configSnap = await getDoc(configRef);
    
    if (configSnap.exists()) {
      const data = configSnap.data();
      return {
        id: configSnap.id,
        seasonalFlavorsImage: data.seasonalFlavorsImage || '/images/saveursaisoncartel.avif',
        eventCard1Image: data.eventCard1Image || '/images/cardevenementiel.avif',
        eventCard2Image: data.eventCard2Image || '/images/cardevenementiel2.avif',
        carteAccueil1Image: data.carteAccueil1Image || '/images/carteacc1.avif',
        carteAccueil2Image: data.carteAccueil2Image || '/images/carteacc2.avif',
        updatedAt: data.updatedAt
      };
    }
    
    // Retourner une configuration par défaut si elle n'existe pas
    return {
      id: 'main',
      seasonalFlavorsImage: '/images/saveursaisoncartel.avif',
      eventCard1Image: '/images/cardevenementiel.avif',
      eventCard2Image: '/images/cardevenementiel2.avif',
      carteAccueil1Image: '/images/carteacc1.avif',
      carteAccueil2Image: '/images/carteacc2.avif'
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration:', error);
    return {
      id: 'main',
      seasonalFlavorsImage: '/images/saveursaisoncartel.avif',
      eventCard1Image: '/images/cardevenementiel.avif',
      eventCard2Image: '/images/cardevenementiel2.avif',
      carteAccueil1Image: '/images/carteacc1.avif',
      carteAccueil2Image: '/images/carteacc2.avif'
    };
  }
};

export const updateContentConfig = async (config: Partial<ContentConfig>): Promise<ContentConfig> => {
  try {
    console.log('updateContentConfig appelé avec:', config);
    const configRef = doc(db, 'contentConfig', 'main');
    
    // Récupérer la configuration actuelle pour fusionner
    console.log('Récupération de la configuration actuelle...');
    const currentConfig = await getContentConfig();
    console.log('Configuration actuelle:', currentConfig);
    
    const configData = {
      ...currentConfig,
      ...config,
      updatedAt: serverTimestamp()
    };
    console.log('Données à sauvegarder:', configData);
    
    // Utiliser setDoc avec merge: true pour créer ou mettre à jour
    console.log('Sauvegarde dans Firebase...');
    await setDoc(configRef, configData, { merge: true });
    console.log('Sauvegarde réussie');
    
    // Récupérer la configuration mise à jour
    console.log('Récupération de la configuration mise à jour...');
    const updatedConfig = await getContentConfig();
    console.log('Configuration mise à jour:', updatedConfig);
    
    return updatedConfig!;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la configuration:', error);
    throw error;
  }
}; 