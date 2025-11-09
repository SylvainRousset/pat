'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';

// Type pour les commandes
interface Order {
  id: string;
  orderId: string;
  clientInfo: {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
  };
  orderDetails: {
    dateRetrait: string;
    heureRetrait: string;
  };
  cartItems: Array<{
    id: string | number;
    name: string;
    price: string;
    image: string;
    quantity: number;
    flavor?: string;
    selectedFlavors?: string[];
    portions?: string;
  }>;
  totalPrice: string;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  createdAt?: { seconds: number };
}

export default function OrdersManagement() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [showStats, setShowStats] = useState(false);
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set([new Date().getFullYear().toString()]));
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  // Vérifier l'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchOrders();
      } else {
        setIsAuthenticated(false);
        router.push('/admin');
      }
    });
    
    return () => unsubscribe();
  }, [router]);

  // Récupérer les commandes
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      // Mettre à jour localement
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Supprimer une commande
  const deleteOrder = async (orderId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setOrders(orders.filter(order => order.id !== orderId));
      setIsDetailsModalOpen(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  // Déconnexion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('adminAuthenticated');
      router.push('/admin');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Obtenir les années disponibles
  const availableYears = Array.from(
    new Set(
      orders
        .filter(order => order.createdAt)
        .map(order => new Date(order.createdAt!.seconds * 1000).getFullYear())
    )
  ).sort((a, b) => b - a);

  // Obtenir les mois (0-11)
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    // Filtre par statut
    if (filterStatus !== 'all' && order.status !== filterStatus) {
      return false;
    }

    // Filtre par année et mois
    if (order.createdAt) {
      const orderDate = new Date(order.createdAt.seconds * 1000);
      const orderYear = orderDate.getFullYear().toString();
      const orderMonth = orderDate.getMonth();

      if (selectedYear !== 'all' && orderYear !== selectedYear) {
        return false;
      }

      if (selectedMonth !== 'all' && orderMonth.toString() !== selectedMonth) {
        return false;
      }
    }

    return true;
  });

  // Calculer les statistiques par mois
  const getMonthlyStats = () => {
    const stats: { [key: string]: { count: number; total: number; orders: Order[] } } = {};

    const ordersToAnalyze = selectedYear === 'all' 
      ? orders 
      : orders.filter(order => {
          if (!order.createdAt) return false;
          const orderYear = new Date(order.createdAt.seconds * 1000).getFullYear().toString();
          return orderYear === selectedYear;
        });

    ordersToAnalyze.forEach(order => {
      if (order.createdAt) {
        const date = new Date(order.createdAt.seconds * 1000);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!stats[key]) {
          stats[key] = { count: 0, total: 0, orders: [] };
        }
        
        stats[key].count++;
        const price = parseFloat(order.totalPrice.replace(/[€\s]/g, '').replace(',', '.')) || 0;
        stats[key].total += price;
        stats[key].orders.push(order);
      }
    });

    return Object.entries(stats).sort(([a], [b]) => b.localeCompare(a));
  };

  // Calculer le total filtré
  const calculateTotal = (ordersList: Order[]) => {
    return ordersList.reduce((sum, order) => {
      const price = parseFloat(order.totalPrice.replace(/[€\s]/g, '').replace(',', '.')) || 0;
      return sum + price;
    }, 0);
  };

  // Toggle année
  const toggleYear = (year: string) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  // Toggle mois
  const toggleMonth = (key: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedMonths(newExpanded);
  };

  // Grouper les commandes par année puis par mois
  const getGroupedOrders = () => {
    const grouped: { [year: string]: { [month: string]: Order[] } } = {};
    
    filteredOrders.forEach(order => {
      if (order.createdAt) {
        const date = new Date(order.createdAt.seconds * 1000);
        const year = date.getFullYear().toString();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        
        if (!grouped[year]) {
          grouped[year] = {};
        }
        if (!grouped[year][month]) {
          grouped[year][month] = [];
        }
        grouped[year][month].push(order);
      }
    });
    
    return grouped;
  };

  // Formater la date
  const formatDate = (timestamp?: { seconds: number }) => {
    if (!timestamp) return 'Date inconnue';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Couleur du badge de statut
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Texte du statut
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'ready': return 'Prête';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  // Formater le prix (enlever le € s'il est déjà présent)
  const formatPrice = (price: string) => {
    // Enlever les espaces et le symbole € s'ils existent
    const cleanPrice = price.replace(/€/g, '').trim();
    return `${cleanPrice} €`;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-[#421500]">Gestion des Commandes</h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-4 py-2 bg-[#a75120] text-white rounded-md hover:bg-[#8a421a] font-medium transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filtres */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Statistiques comptables */}
        <div className="bg-gradient-to-r from-[#a75120] to-[#8a421a] rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">📊 Récapitulatif Comptable</h3>
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors"
            >
              {showStats ? 'Masquer' : 'Afficher'} les détails
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm opacity-90">
                Total {selectedMonth !== 'all' ? months[parseInt(selectedMonth)] : ''} {selectedYear !== 'all' ? selectedYear : 'période filtrée'}
              </p>
              <p className="text-3xl font-bold">{calculateTotal(filteredOrders).toFixed(2)} €</p>
              <p className="text-xs opacity-75 mt-1">{filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm opacity-90">Total {selectedYear}</p>
              <p className="text-3xl font-bold">
                {calculateTotal(
                  orders.filter(o => {
                    if (!o.createdAt) return false;
                    return new Date(o.createdAt.seconds * 1000).getFullYear().toString() === selectedYear;
                  })
                ).toFixed(2)} €
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm opacity-90">Total général</p>
              <p className="text-3xl font-bold">{calculateTotal(orders).toFixed(2)} €</p>
              <p className="text-xs opacity-75 mt-1">{orders.length} commande{orders.length > 1 ? 's' : ''}</p>
            </div>
          </div>

          {showStats && (
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Détails par mois</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getMonthlyStats().map(([key, data]) => {
                  const [year, month] = key.split('-');
                  return (
                    <div key={key} className="bg-white/10 rounded p-3">
                      <p className="font-medium">{months[parseInt(month) - 1]} {year}</p>
                      <p className="text-2xl font-bold">{data.total.toFixed(2)} €</p>
                      <p className="text-xs opacity-75">{data.count} commande{data.count > 1 ? 's' : ''}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Filtres période */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">📅 Filtrer par période</h3>
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedMonth('all');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#a75120]"
            >
              <option value="all">Toutes les années</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#a75120]"
              disabled={selectedYear === 'all'}
            >
              <option value="all">Tous les mois</option>
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>

            {(selectedYear !== new Date().getFullYear().toString() || selectedMonth !== 'all') && (
              <button
                onClick={() => {
                  setSelectedYear(new Date().getFullYear().toString());
                  setSelectedMonth('all');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Filtres statut */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">🏷️ Filtrer par statut</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-[#a75120] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes ({orders.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              }`}
            >
              En attente ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('confirmed')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === 'confirmed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              Confirmées ({orders.filter(o => o.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setFilterStatus('ready')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === 'ready'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              Prêtes ({orders.filter(o => o.status === 'ready').length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === 'completed'
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Terminées ({orders.filter(o => o.status === 'completed').length})
            </button>
          </div>
        </div>

        {/* Liste des commandes */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a75120] mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des commandes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500">Aucune commande trouvée</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(() => {
              const grouped = getGroupedOrders();
              const years = Object.keys(grouped).sort((a, b) => parseInt(b) - parseInt(a));

              return years.map(year => {
                const yearOrders = Object.values(grouped[year]).flat();
                const yearTotal = calculateTotal(yearOrders);
                const isYearExpanded = expandedYears.has(year);

                return (
                  <div key={year} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* En-tête Année */}
                    <button
                      onClick={() => toggleYear(year)}
                      className="w-full bg-gradient-to-r from-[#421500] to-[#632100] text-white p-5 flex justify-between items-center hover:from-[#532100] hover:to-[#742400] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <svg 
                          className={`w-6 h-6 transition-transform ${isYearExpanded ? 'rotate-90' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <div className="text-left">
                          <h2 className="text-2xl font-bold">{year}</h2>
                          <p className="text-sm opacity-90">{yearOrders.length} commande{yearOrders.length > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">Total annuel</p>
                        <p className="text-3xl font-bold">{yearTotal.toFixed(2)} €</p>
                      </div>
                    </button>

                    {/* Contenu de l'année (mois) */}
                    {isYearExpanded && (
                      <div className="bg-gray-50 p-4 space-y-3">
                        {Object.keys(grouped[year])
                          .sort((a, b) => parseInt(b) - parseInt(a))
                          .map(month => {
                            const monthOrders = grouped[year][month];
                            const monthKey = `${year}-${month}`;
                            const monthTotal = calculateTotal(monthOrders);
                            const isMonthExpanded = expandedMonths.has(monthKey);
                            const monthName = months[parseInt(month) - 1];

                            return (
                              <div key={monthKey} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                {/* En-tête Mois */}
                                <button
                                  onClick={() => toggleMonth(monthKey)}
                                  className="w-full bg-gradient-to-r from-[#a75120] to-[#8a421a] text-white p-4 flex justify-between items-center hover:from-[#8a421a] hover:to-[#6d3415] transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <svg 
                                      className={`w-5 h-5 transition-transform ${isMonthExpanded ? 'rotate-90' : ''}`}
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <div className="text-left">
                                      <h3 className="text-lg font-bold">{monthName}</h3>
                                      <p className="text-xs opacity-90">{monthOrders.length} commande{monthOrders.length > 1 ? 's' : ''}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs opacity-90">Total</p>
                                    <p className="text-xl font-bold">{monthTotal.toFixed(2)} €</p>
                                  </div>
                                </button>

                                {/* Contenu du mois (commandes) */}
                                {isMonthExpanded && (
                                  <div className="p-3 space-y-3 bg-gray-50">
                                    {monthOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                onClick={() => {
                  setSelectedOrder(order);
                  setIsDetailsModalOpen(true);
                }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#421500]">
                        Commande #{order.orderId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.clientInfo.prenom} {order.clientInfo.nom}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Passée le {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Date de retrait</p>
                      <p className="font-medium text-gray-900">{order.orderDetails.dateRetrait}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Heure</p>
                      <p className="font-medium text-gray-900">{order.orderDetails.heureRetrait}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Articles</p>
                      <p className="font-medium text-gray-900">
                        {order.cartItems.reduce((sum, item) => sum + item.quantity, 0)} article{order.cartItems.reduce((sum, item) => sum + item.quantity, 0) > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-bold text-[#D9844A]">{formatPrice(order.totalPrice)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order.id, 'confirmed');
                        }}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                      >
                        Confirmer
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order.id, 'ready');
                        }}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600 transition-colors"
                      >
                        Marquer prête
                      </button>
                    )}
                    {order.status === 'ready' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order.id, 'completed');
                        }}
                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Marquer terminée
                      </button>
                    )}
                  </div>
                </div>
              </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>

      {/* Modal de détails */}
      {isDetailsModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#421500]">
                Détails de la commande #{selectedOrder.orderId}
              </h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Statut */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Statut de la commande</h3>
                <div className="flex gap-2">
                  {(['pending', 'confirmed', 'ready', 'completed', 'cancelled'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectedOrder.status === status
                          ? getStatusColor(status) + ' ring-2 ring-offset-2 ring-gray-400'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {getStatusText(status)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Informations client */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informations client</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom complet</p>
                    <p className="font-medium">{selectedOrder.clientInfo.prenom} {selectedOrder.clientInfo.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="font-medium">{selectedOrder.clientInfo.telephone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedOrder.clientInfo.email}</p>
                  </div>
                </div>
              </div>

              {/* Détails du retrait */}
              <div className="bg-amber-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Détails du retrait</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{selectedOrder.orderDetails.dateRetrait}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Heure</p>
                    <p className="font-medium">{selectedOrder.orderDetails.heureRetrait}</p>
                  </div>
                </div>
              </div>

              {/* Articles commandés */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Articles commandés</h3>
                <div className="space-y-3">
                  {selectedOrder.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white border border-gray-200 rounded-lg p-3">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.flavor && (
                          <p className="text-xs text-gray-500">Saveur: {item.flavor}</p>
                        )}
                        {item.selectedFlavors && item.selectedFlavors.length > 0 && (
                          <p className="text-xs text-gray-500">Saveurs: {item.selectedFlavors.join(', ')}</p>
                        )}
                        {item.portions && (
                          <p className="text-xs text-gray-500">Portions: {item.portions}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                        <p className="font-bold text-[#D9844A]">{item.price} €</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <p className="text-lg font-semibold">Total</p>
                  <p className="text-2xl font-bold text-[#D9844A]">{formatPrice(selectedOrder.totalPrice)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={() => deleteOrder(selectedOrder.id)}
                  className="px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

