import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, getOrderById, addOrder, updateOrder, deleteOrder } from '@/lib/firebaseAdmin';

// GET - Récupérer toutes les commandes ou une commande spécifique
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Récupérer une commande spécifique
      const order = await getOrderById(id);
      if (!order) {
        return NextResponse.json(
          { error: 'Commande non trouvée' },
          { status: 404 }
        );
      }
      return NextResponse.json(order);
    } else {
      // Récupérer toutes les commandes
      const orders = await getAllOrders();
      // Trier par date de création décroissante (plus récent en premier)
      const sortedOrders = orders.sort((a, b) => {
        const dateA = a.createdAt ? (a.createdAt as { seconds: number }).seconds : 0;
        const dateB = b.createdAt ? (b.createdAt as { seconds: number }).seconds : 0;
        return dateB - dateA;
      });
      return NextResponse.json(sortedOrders);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    );
  }
}

// POST - Ajouter une nouvelle commande
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // Validation simple
    if (!orderData.orderId || !orderData.clientInfo || !orderData.cartItems) {
      return NextResponse.json(
        { error: 'Données de commande incomplètes' },
        { status: 400 }
      );
    }
    
    // Ajouter le statut par défaut si non fourni
    const orderToAdd = {
      ...orderData,
      status: orderData.status || 'pending'
    };
    
    // Ajouter la commande à Firebase
    const addedOrder = await addOrder(orderToAdd);
    
    return NextResponse.json(addedOrder, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de la commande' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une commande (notamment le statut)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de commande manquant' },
        { status: 400 }
      );
    }
    
    const updateData = await request.json();
    
    // Mettre à jour la commande
    const updatedOrder = await updateOrder(id, updateData);
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la commande' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une commande
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de commande manquant' },
        { status: 400 }
      );
    }
    
    const success = await deleteOrder(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de la commande' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de la commande:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la commande' },
      { status: 500 }
    );
  }
}

