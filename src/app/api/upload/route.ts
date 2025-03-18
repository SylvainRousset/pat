import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'votre-cloud-name',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || 'votre-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'votre-api-secret',
  secure: true
});

export async function POST(request: NextRequest) {
  try {
    console.log('Début de la requête d\'upload d\'image');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('Aucun fichier n\'a été fourni dans la requête');
      return NextResponse.json(
        { error: 'Aucun fichier n\'a été fourni' },
        { status: 400 }
      );
    }
    
    console.log('Fichier reçu:', file.name, 'Type:', file.type, 'Taille:', file.size, 'bytes');
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      console.error('Type de fichier non autorisé:', file.type);
      return NextResponse.json(
        { error: 'Seules les images sont autorisées' },
        { status: 400 }
      );
    }
    
    // Convertir le fichier en base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
    
    // Télécharger l'image vers Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: 'patisserie',
      resource_type: 'image',
      public_id: `product_${Date.now()}`,
    });
    
    console.log('Image téléchargée avec succès. URL:', uploadResult.secure_url);
    
    return NextResponse.json({ imageUrl: uploadResult.secure_url });
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image:', error);
    
    // Extraire le message d'erreur
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erreur inconnue lors du téléchargement de l\'image';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}; 