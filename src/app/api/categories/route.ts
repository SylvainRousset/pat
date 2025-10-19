import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllCategories, 
  addCategory, 
  createOrGetCategory,
  updateCategory,
  deleteCategory,
  getCategoryById 
} from '@/lib/firebaseAdmin';

// GET - Récupérer toutes les catégories
export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle catégorie ou récupérer une existante
export async function POST(request: NextRequest) {
  try {
    const { name, description, createIfNotExists = true } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Le nom de la catégorie est obligatoire' },
        { status: 400 }
      );
    }
    
    let category;
    
    if (createIfNotExists) {
      // Créer ou récupérer la catégorie
      category = await createOrGetCategory(name);
    } else {
      // Créer une nouvelle catégorie
      category = await addCategory({ name, description });
    }
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une catégorie
export async function PUT(request: NextRequest) {
  try {
    const { id, name, description } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'L\'ID de la catégorie est obligatoire' },
        { status: 400 }
      );
    }
    
    const updatedCategory = await updateCategory(id, { name, description });
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la catégorie' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'L\'ID de la catégorie est obligatoire' },
        { status: 400 }
      );
    }
    
    const success = await deleteCategory(id);
    
    if (success) {
      return NextResponse.json({ message: 'Catégorie supprimée avec succès' });
    } else {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression de la catégorie' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    );
  }
}
