import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllProducts, 
  getFilteredProducts, 
  getProductById, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '@/lib/firebaseAdmin';
import { deleteImage } from '@/lib/cloudinary';

// GET - Récupérer tous les produits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showInShop = searchParams.get('showInShop');
    const showOnHome = searchParams.get('showOnHome');
    
    const filters: { showInShop?: boolean; showOnHome?: boolean } = {};
    
    if (showInShop === 'true') {
      filters.showInShop = true;
    }
    
    if (showOnHome === 'true') {
      filters.showOnHome = true;
    }
    
    // Si des filtres sont spécifiés, utiliser getFilteredProducts
    const allProducts = Object.keys(filters).length > 0 
      ? await getFilteredProducts(filters)
      : await getAllProducts();
    
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

// POST - Ajouter un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const newProduct = await request.json();
    
    // Validation simple
    if (!newProduct.name || !newProduct.price || !newProduct.image || !newProduct.description) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }
    
    // S'assurer que les champs booléens sont définis
    const showInShop = newProduct.showInShop !== undefined ? newProduct.showInShop : true;
    const showOnHome = newProduct.showOnHome !== undefined ? newProduct.showOnHome : true;
    
    const productToAdd = { 
      ...newProduct, 
      showInShop,
      showOnHome
    };
    
    // Ajouter le produit à Firebase
    const addedProduct = await addProduct(productToAdd);
    
    return NextResponse.json(addedProduct, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l&apos;ajout du produit:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l&apos;ajout du produit' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un produit
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du produit manquant' },
        { status: 400 }
      );
    }
    
    const updates = await request.json();
    const updatedProduct = await updateProduct(id, updates);
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un produit
export async function DELETE(request: NextRequest) {
  try {
    console.log('DELETE: Début de la requête de suppression de produit');
    
    // Récupérer l'ID du produit dans l'URL
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      console.error('DELETE: Aucun ID de produit fourni');
      return NextResponse.json(
        { error: 'L\'ID du produit est requis' },
        { status: 400 }
      );
    }
    
    console.log('DELETE: Tentative de suppression du produit avec ID:', id);
    
    // Récupérer le produit avant de le supprimer pour obtenir l'URL de l'image
    const product = await getProductById(id);
    
    if (!product) {
      console.error('DELETE: Produit non trouvé avec ID:', id);
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }
    
    console.log('DELETE: Produit trouvé, détails:', {
      id: product.id,
      name: product.name,
      hasImage: !!product.image
    });
    
    // Supprimer le produit de Firebase
    const deleteResult = await deleteProduct(id);
    console.log('DELETE: Résultat de la suppression du produit:', deleteResult);
    
    if (!deleteResult) {
      console.error('DELETE: Échec de la suppression du produit dans Firebase');
      return NextResponse.json(
        { error: 'Échec de la suppression du produit dans la base de données' },
        { status: 500 }
      );
    }
    
    // Si le produit a une image et qu'elle est hébergée sur Cloudinary, la supprimer
    if (product.image && product.image.includes('cloudinary.com')) {
      try {
        console.log('DELETE: Tentative de suppression de l\'image Cloudinary:', product.image);
        const imageDeleted = await deleteImage(product.image);
        console.log('DELETE: Image supprimée de Cloudinary:', imageDeleted);
      } catch (imageError) {
        console.error('DELETE: Erreur lors de la suppression de l\'image:', imageError);
        // On continue même si la suppression de l'image échoue
      }
    }
    
    console.log('DELETE: Suppression du produit terminée avec succès');
    return NextResponse.json({ 
      success: true,
      message: 'Produit supprimé avec succès',
      productId: id 
    });
  } catch (error) {
    console.error('DELETE: Erreur lors de la suppression du produit:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur inconnue lors de la suppression du produit' },
      { status: 500 }
    );
  }
} 