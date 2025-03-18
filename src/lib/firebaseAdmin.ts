import { db, storage } from './firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import admin from 'firebase-admin';
import { cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// Interface pour les produits
interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  showInShop: boolean;
  showOnHome: boolean;
  [key: string]: unknown;
}

// Interface pour les erreurs
interface ApiError {
  message: string;
  code?: string | number;
}

// Type pour les produits
export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  showInShop: boolean;
  showOnHome: boolean;
  createdAt?: any;
  updatedAt?: any;
}

// Collection de produits
const productsCollection = collection(db, 'products');

// Récupérer tous les produits
export const getAllProducts = async () => {
  const snapshot = await getDocs(productsCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
};

// Récupérer les produits filtrés
export const getFilteredProducts = async (filters: { showInShop?: boolean, showOnHome?: boolean }) => {
  let q = productsCollection;
  
  if (filters.showInShop !== undefined || filters.showOnHome !== undefined) {
    const conditions = [];
    
    if (filters.showInShop !== undefined) {
      conditions.push(where('showInShop', '==', filters.showInShop));
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
    const db = getFirestore();
    const productRef = db.collection('products').doc(productId);
    const productDoc = await productRef.get();
    
    if (!productDoc.exists) {
      return null;
    }
    
    return {
      id: productDoc.id,
      ...productDoc.data() as Omit<Product, 'id'>
    };
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
    const db = getFirestore();
    await db.collection('products').doc(productId).delete();
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return false;
  }
};

// Télécharger une image
export const uploadProductImage = async (file: File, productId: string) => {
  try {
    console.log('Simulation de téléchargement d\'image:', file.name);
    
    // Au lieu d'utiliser Firebase Storage, nous allons simplement retourner un chemin local
    // Cela suppose que les images sont déjà disponibles dans le dossier public/images
    
    // Nous gardons le nom du fichier original
    const fileName = file.name;
    
    // Simuler un délai pour l'upload
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retourner un chemin local vers le dossier public/images
    const imagePath = `/images/${fileName}`;
    console.log('Chemin d\'image simulé:', imagePath);
    
    return imagePath;
  } catch (error) {
    console.error('Erreur lors de la simulation de téléchargement d\'image:', error);
    throw new Error(`Erreur lors du téléchargement de l'image: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
};

// Supprimer une image
export const deleteProductImage = async (imageUrl: string) => {
  // Extraire le chemin de l'URL
  const storageRef = ref(storage, imageUrl);
  await deleteObject(storageRef);
  return { success: true };
}; 