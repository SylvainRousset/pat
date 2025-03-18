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

// Type pour les produits
interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  description: string;
  showInShop: boolean;
  showOnHome: boolean;
}

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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du produit manquant' },
        { status: 400 }
      );
    }
    
    // Récupérer le produit pour obtenir l'URL de l'image
    const product = await getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }
    
    // Supprimer le produit de Firebase
    await deleteProduct(id);
    
    // Si le produit a une image et qu'elle est hébergée sur Cloudinary, la supprimer
    if (product.image && product.image.includes('cloudinary.com')) {
      try {
        console.log('Suppression de l&apos;image Cloudinary:', product.image);
        const imageDeleted = await deleteImage(product.image);
        console.log('Image supprimée de Cloudinary:', imageDeleted);
      } catch (imageError) {
        console.error('Erreur lors de la suppression de l&apos;image:', imageError);
        // On continue même si la suppression de l'image échoue
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du produit' },
      { status: 500 }
    );
  }
} 