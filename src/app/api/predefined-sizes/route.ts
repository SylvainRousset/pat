import { NextRequest, NextResponse } from 'next/server';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Interface pour les tailles prédéfinies
interface PredefinedSize {
  id: string;
  name: string;
  price: string;
  createdAt?: unknown;
}

// GET - Récupérer toutes les tailles prédéfinies
export async function GET() {
  try {
    const sizesRef = collection(db, 'predefinedSizes');
    const snapshot = await getDocs(sizesRef);
    
    const sizes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PredefinedSize[];
    
    return NextResponse.json(sizes);
  } catch (error) {
    console.error('Erreur lors de la récupération des tailles prédéfinies:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des tailles prédéfinies' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle taille prédéfinie
export async function POST(request: NextRequest) {
  try {
    const { name, price } = await request.json();
    
    // Validation
    if (!name || !price) {
      return NextResponse.json(
        { error: 'Le nom et le prix sont obligatoires' },
        { status: 400 }
      );
    }
    
    // Vérifier si une taille avec ce nom existe déjà
    const sizesRef = collection(db, 'predefinedSizes');
    const snapshot = await getDocs(sizesRef);
    const existingSize = snapshot.docs.find(doc => doc.data().name === name);
    
    if (existingSize) {
      return NextResponse.json(
        { error: 'Une taille avec ce nom existe déjà' },
        { status: 400 }
      );
    }
    
    // Créer la nouvelle taille
    const newSize = {
      name: name.trim(),
      price: price.trim(),
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(sizesRef, newSize);
    
    return NextResponse.json({
      id: docRef.id,
      ...newSize
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur lors de la création de la taille prédéfinie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la taille prédéfinie' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une taille prédéfinie
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de la taille manquant' },
        { status: 400 }
      );
    }
    
    const docRef = doc(db, 'predefinedSizes', id);
    await deleteDoc(docRef);
    
    return NextResponse.json({ 
      success: true,
      message: 'Taille prédéfinie supprimée avec succès',
      sizeId: id 
    });
    
  } catch (error) {
    console.error('Erreur lors de la suppression de la taille prédéfinie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la taille prédéfinie' },
      { status: 500 }
    );
  }
}
