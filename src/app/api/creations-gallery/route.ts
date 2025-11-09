import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllCreationsGalleryItems, 
  getCreationGalleryItemById, 
  addCreationGalleryItem, 
  updateCreationGalleryItem, 
  deleteCreationGalleryItem 
} from '@/lib/firebaseAdmin';

// GET - Récupérer toutes les images de la galerie ou une image spécifique
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Récupérer une image spécifique
      const item = await getCreationGalleryItemById(id);
      if (!item) {
        return NextResponse.json(
          { error: 'Image non trouvée' },
          { status: 404 }
        );
      }
      return NextResponse.json(item);
    } else {
      // Récupérer toutes les images
      const items = await getAllCreationsGalleryItems();
      // Trier par date de création décroissante (plus récent en premier)
      const sortedItems = items.sort((a, b) => {
        const dateA = a.createdAt ? (a.createdAt as { seconds: number }).seconds : 0;
        const dateB = b.createdAt ? (b.createdAt as { seconds: number }).seconds : 0;
        return dateB - dateA;
      });
      return NextResponse.json(sortedItems);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des images' },
      { status: 500 }
    );
  }
}

// POST - Ajouter une nouvelle image à la galerie
export async function POST(request: NextRequest) {
  try {
    const itemData = await request.json();
    
    // Validation simple
    if (!itemData.title || !itemData.image) {
      return NextResponse.json(
        { error: 'Titre et image requis' },
        { status: 400 }
      );
    }
    
    // Ajouter l'image à Firebase
    const addedItem = await addCreationGalleryItem(itemData);
    
    return NextResponse.json(addedItem, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'image:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout de l\'image' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une image de la galerie
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      );
    }
    
    const updateData = await request.json();
    
    // Mettre à jour l'image
    const updatedItem = await updateCreationGalleryItem(id, updateData);
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'image:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'image' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une image de la galerie
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID manquant' },
        { status: 400 }
      );
    }
    
    const success = await deleteCreationGalleryItem(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de l\'image' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'image:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'image' },
      { status: 500 }
    );
  }
}

