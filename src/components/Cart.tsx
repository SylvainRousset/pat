'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    totalItems, 
    totalPrice, 
    isCartOpen, 
    toggleCart 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 overflow-hidden">
      {/* Panneau du panier */}
      <div className="h-full max-w-full flex justify-end">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto border-l border-gray-200">
            
            {/* En-tête du panier */}
            <div className="flex items-center justify-between px-4 py-6 bg-amber-600 text-white">
              <h2 className="text-lg font-medium">Votre Panier ({totalItems})</h2>
              <button 
                onClick={toggleCart}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Contenu du panier */}
            <div className="flex-1 px-4 py-6 sm:px-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Votre panier est vide</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Commencez votre shopping en ajoutant des produits à votre panier.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={toggleCart}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                      Continuer vos achats
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flow-root">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {cart.map((item) => (
                      <li key={item.id} className="py-6 flex">
                        {/* Image du produit */}
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="96px"
                          />
                        </div>

                        {/* Détails du produit */}
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between">
                              <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-900">
                                  <Link href={`/produit/${item.id}`}>
                                    {item.flavorManagementType === 'pack' 
                                      ? `${item.name.split(' - Pack de')[0]} - Pack de ${item.portions}`
                                      : item.name
                                    }
                                  </Link>
                                </h3>
                                {/* Afficher les saveurs en badges */}
                                <div className="mt-2">
                                  {item.flavorManagementType === 'pack' ? (
                                    // Mode pack : regrouper les saveurs identiques et afficher avec le nombre
                                    <>
                                      {item.selectedFlavors && item.selectedFlavors.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-1">
                                          {(() => {
                                            // Compter les occurrences de chaque saveur
                                            const flavorCounts = item.selectedFlavors.reduce((acc, flavor) => {
                                              acc[flavor] = (acc[flavor] || 0) + 1;
                                              return acc;
                                            }, {} as Record<string, number>);
                                            
                                            // Créer les badges avec les saveurs et leurs comptages
                                            return Object.entries(flavorCounts).map(([flavor, count], index) => (
                                              <span 
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 shadow-sm"
                                              >
                                                <span className="mr-1">{flavor}</span>
                                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold">
                                                  {count}
                                                </span>
                                              </span>
                                            ));
                                          })()}
                                        </div>
                                      )}
                                    </>
                                  ) : (
                                    // Mode standard : afficher une saveur unique en badge
                                    <>
                                      {item.flavor && (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mr-2 shadow-sm">
                                          {item.flavor}
                                        </span>
                                      )}
                                      {item.portions && (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 shadow-sm">
                                          {item.portions}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                              <p className="ml-4">{parseFloat(item.price).toFixed(2)} €</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-1 items-end justify-between text-sm">
                            {/* Contrôle de quantité */}
                            <div className="flex items-center border rounded-md">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 text-gray-600 hover:text-amber-600"
                              >
                                -
                              </button>
                              <span className="px-2 py-1 text-gray-900">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 text-gray-600 hover:text-amber-600"
                              >
                                +
                              </button>
                            </div>

                            {/* Bouton de suppression */}
                            <button
                              type="button"
                              onClick={() => {
                                console.log('Suppression article ID:', item.id, 'Type:', typeof item.id);
                                removeFromCart(item.id);
                              }}
                              className="font-medium text-amber-600 hover:text-amber-800"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Pied du panier avec total et boutons */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Sous-total</p>
                  <p>{totalPrice}</p>
                </div>
                
                <div className="flex justify-between mb-6">
                  <button
                    onClick={clearCart}
                    className="text-sm font-medium text-amber-600 hover:text-amber-800"
                  >
                    Vider le panier
                  </button>
                </div>
                
                <div className="mt-6">
                  <Link
                    href="/checkout"
                    className="flex items-center justify-center rounded-md border border-transparent bg-amber-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-amber-700"
                    onClick={toggleCart}
                  >
                    Passer la commande
                  </Link>
                </div>
                
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    ou{' '}
                    <button
                      type="button"
                      className="font-medium text-amber-600 hover:text-amber-800"
                      onClick={toggleCart}
                    >
                      Continuer vos achats
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 