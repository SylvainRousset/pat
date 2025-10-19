'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef, useMemo } from 'react';

// Définition du type pour un produit dans le panier
export type CartItem = {
  id: string | number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  slug: string;
  flavor?: string;
  portions?: string;
};

// Interface pour le contexte du panier
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, openCart?: boolean) => void;
  addMultipleToCart: (product: Omit<CartItem, 'quantity'>, quantity: number, openCart?: boolean) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: string;
  isCartOpen: boolean;
  toggleCart: () => void;
}

// Création du contexte avec une valeur par défaut
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte du panier
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart doit être utilisé à l\'intérieur d\'un CartProvider');
  }
  return context;
};

// Props pour le provider du panier
interface CartProviderProps {
  children: ReactNode;
}

// Provider du panier
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // État du panier
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const isProcessingRef = useRef(false);
  const operationCounterRef = useRef(0);

  // Charger le panier depuis le localStorage au chargement
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // S'assurer que tous les prix sont nettoyés lors du chargement
        const cleanedCart = parsedCart.map((item: CartItem) => ({
          ...item,
          price: typeof item.price === 'string' ? item.price.replace(/[^\d.,]/g, '').replace(',', '.') : item.price
        }));
        setCart(cleanedCart);
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        setCart([]);
      }
    }
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    // S'assurer que tous les prix sont nettoyés avant la sauvegarde
    const cleanedCart = cart.map(item => ({
      ...item,
      price: item.price.replace(/[^\d.,]/g, '').replace(',', '.')
    }));
    localStorage.setItem('cart', JSON.stringify(cleanedCart));
  }, [cart]);

  // Ajouter un produit au panier (quantité = 1)
  const addToCart = useCallback((product: Omit<CartItem, 'quantity'>, openCart: boolean = false) => {
    setCart(prevCart => {
      // Vérifier si le produit est déjà dans le panier (comparaison directe des IDs)
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);

      if (existingItemIndex >= 0) {
        // Si le produit existe déjà, augmenter la quantité
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // Sinon, ajouter le nouveau produit avec une quantité de 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    // Ouvrir le panier seulement si openCart est true
    if (openCart) {
      setIsCartOpen(true);
    }
  }, []);

  // Ajouter plusieurs produits du même type au panier
  const addMultipleToCart = useCallback((product: Omit<CartItem, 'quantity'>, quantity: number, openCart: boolean = false) => {
    console.log('addMultipleToCart appelé avec:', { product: product.name, quantity });

    // Vérification avec useRef pour éviter les appels multiples
    if (isProcessingRef.current) {
      console.log('addMultipleToCart ignoré - déjà en cours de traitement');
      return;
    }

    // Marquer comme en cours de traitement
    isProcessingRef.current = true;
    operationCounterRef.current += 1;
    const currentOperation = operationCounterRef.current;

    console.log('Opération numéro:', currentOperation);

    // Utiliser une approche différente pour éviter les doubles appels
    const currentCart = cart; // Utiliser la valeur actuelle du panier
    console.log('setCart appelé avec currentCart:', currentCart.length, 'éléments, opération:', currentOperation);
    console.log('Recherche produit avec ID:', product.id);
    
    // Vérifier si le produit est déjà dans le panier (comparaison par ID unique)
    const existingItemIndex = currentCart.findIndex(item => {
      console.log('Comparaison:', item.id, '===', product.id, '?', item.id === product.id);
      return item.id === product.id;
    });

    let newCart: CartItem[];
    if (existingItemIndex >= 0) {
      // Si le produit existe déjà, augmenter la quantité
      newCart = [...currentCart];
      newCart[existingItemIndex].quantity += quantity;
      console.log('Augmentation quantité:', currentCart[existingItemIndex].quantity, '->', newCart[existingItemIndex].quantity, 'opération:', currentOperation);
    } else {
      // Sinon, ajouter le nouveau produit avec la quantité spécifiée
      console.log('Ajout nouveau produit avec quantité:', quantity, 'opération:', currentOperation);
      newCart = [...currentCart, { ...product, quantity: quantity }];
    }

    // Appeler setCart une seule fois avec la nouvelle valeur
    setCart(newCart);

    // Réactiver après un court délai
    setTimeout(() => {
      isProcessingRef.current = false;
    }, 50);

    // Ouvrir le panier seulement si openCart est true
    if (openCart) {
      setIsCartOpen(true);
    }
  }, [cart]);

  // Supprimer un produit du panier
  const removeFromCart = useCallback((id: string | number) => {
    console.log('removeFromCart appelé avec ID:', id, 'Type:', typeof id);
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.id !== id);
      console.log('Panier après suppression:', newCart.length, 'éléments');
      return newCart;
    });
  }, []);

  // Mettre à jour la quantité d'un produit
  const updateQuantity = useCallback((id: string | number, quantity: number) => {
    console.log('updateQuantity appelé avec ID:', id, 'Quantité:', quantity);
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  // Vider le panier
  const clearCart = useCallback(() => {
    console.log('clearCart appelé');
    setCart([]);
  }, []);

  // Calculer le nombre total d'articles
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculer le prix total
  const totalPrice = cart.reduce((total, item) => {
    // Nettoyer le prix en supprimant tous les caractères sauf les chiffres, le point et la virgule
    const cleanPrice = item.price.replace(/[^\d.,]/g, '').replace(',', '.');
    const price = parseFloat(cleanPrice);

    // Vérifier que le prix est un nombre valide
    if (isNaN(price)) {
      console.warn(`Prix invalide pour le produit ${item.name}: ${item.price}`);
      return total;
    }

    return total + (price * item.quantity);
  }, 0).toFixed(2) + ' €';

  // Ouvrir/fermer le panier
  const toggleCart = useCallback(() => {
    setIsCartOpen(!isCartOpen);
  }, [isCartOpen]);

  // Valeur du contexte stabilisée avec useMemo
  const value = useMemo(() => ({
    cart,
    addToCart,
    addMultipleToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    toggleCart
  }), [cart, addToCart, addMultipleToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, toggleCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 