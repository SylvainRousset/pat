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

// Interface pour les parfums prédéfinis
interface PredefinedFlavor {
  id: string;
  name: string;
  createdAt?: unknown;
}

// GET - Récupérer tous les parfums prédéfinis
export async function GET() {
  try {
    const flavorsRef = collection(db, 'predefinedFlavors');
    const snapshot = await getDocs(flavorsRef);
    
    const flavors = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PredefinedFlavor[];
    
    return NextResponse.json(flavors);
  } catch (error) {
    console.error('Erreur lors de la récupération des parfums prédéfinis:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des parfums prédéfinis' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau parfum prédéfini
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Le nom est obligatoire' },
        { status: 400 }
      );
    }
    
    // Vérifier si un parfum avec ce nom existe déjà
    const flavorsRef = collection(db, 'predefinedFlavors');
    const snapshot = await getDocs(flavorsRef);
    const existingFlavor = snapshot.docs.find(doc => doc.data().name === name);
    
    if (existingFlavor) {
      return NextResponse.json(
        { error: 'Un parfum avec ce nom existe déjà' },
        { status: 400 }
      );
    }
    
    // Créer le nouveau parfum
    const newFlavor = {
      name: name.trim(),
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(flavorsRef, newFlavor);
    
    return NextResponse.json({
      id: docRef.id,
      ...newFlavor
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erreur lors de la création du parfum prédéfini:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du parfum prédéfini' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un parfum prédéfini
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du parfum manquant' },
        { status: 400 }
      );
    }
    
    const docRef = doc(db, 'predefinedFlavors', id);
    await deleteDoc(docRef);
    
    return NextResponse.json({ 
      success: true,
      message: 'Parfum prédéfini supprimé avec succès',
      flavorId: id 
    });
    
  } catch (error) {
    console.error('Erreur lors de la suppression du parfum prédéfini:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du parfum prédéfini' },
      { status: 500 }
    );
  }
}

