'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Définition du type pour un produit dans le panier
export type CartItem = {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  slug: string;
};

// Interface pour le contexte du panier
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, openCart?: boolean) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
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

  // Charger le panier depuis le localStorage au chargement
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
        setCart([]);
      }
    }
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Ajouter un produit au panier
  const addToCart = (product: Omit<CartItem, 'quantity'>, openCart: boolean = false) => {
    setCart(prevCart => {
      // Vérifier si le produit est déjà dans le panier
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
  };

  // Supprimer un produit du panier
  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
  };

  // Calculer le nombre total d'articles
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculer le prix total
  const totalPrice = cart.reduce((total, item) => {
    const price = parseFloat(item.price.replace('€', '').trim());
    return total + (price * item.quantity);
  }, 0).toFixed(2) + ' €';

  // Ouvrir/fermer le panier
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Valeur du contexte
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    toggleCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 