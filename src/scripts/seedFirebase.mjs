// Script pour initialiser Firebase avec les données de base
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDdu-PuS-LVCmYa3CuYvqudl1y-jBKCjoY",
  authDomain: "patisse-a2531.firebaseapp.com",
  projectId: "patisse-a2531",
  storageBucket: "patisse-a2531.appspot.com",
  messagingSenderId: "392267904323",
  appId: "1:392267904323:web:ae942610b0b800b6aaabf6"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Données des produits de base
const initialProducts = [
  {
    name: 'La Boîte à Choux',
    price: '18 €',
    image: '/images/laboite-a-choux.avif',
    description: 'Une sélection raffinée de choux gourmands aux saveurs printanières.',
    showInShop: true,
    showOnHome: true
  },
  {
    name: 'La Boîte à Flowercake',
    price: '24 €',
    image: '/images/laboite-a-flowercake.avif',
    description: 'Des créations florales délicates pour célébrer le printemps.',
    showInShop: true,
    showOnHome: true
  },
  {
    name: 'La Boîte Revisitée',
    price: '20 €',
    image: '/images/la-boite-arevisite.avif',
    description: 'Nos classiques réinventés avec une touche de modernité.',
    showInShop: true,
    showOnHome: true
  }
];

// Fonction pour vérifier si un produit existe déjà
const productExists = async (name) => {
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("name", "==", name));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

// Fonction pour ajouter les produits
const seedProducts = async () => {
  try {
    console.log("Début de l'initialisation des produits...");
    
    const productsRef = collection(db, "products");
    let addedCount = 0;
    
    for (const product of initialProducts) {
      // Vérifier si le produit existe déjà
      const exists = await productExists(product.name);
      
      if (!exists) {
        await addDoc(productsRef, {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`Produit ajouté: ${product.name}`);
        addedCount++;
      } else {
        console.log(`Produit déjà existant: ${product.name}`);
      }
    }
    
    console.log(`Initialisation terminée. ${addedCount} produits ajoutés.`);
  } catch (error) {
    console.error("Erreur lors de l'initialisation des produits:", error);
  }
};

// Exécuter la fonction d'initialisation
seedProducts(); 