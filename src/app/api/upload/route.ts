import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configuration de Cloudinary
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Vérifier que les variables sont définies
if (!cloudName || !apiKey || !apiSecret) {
  console.error('Variables d\'environnement Cloudinary manquantes!', {
    cloudName: !!cloudName,
    apiKey: !!apiKey,
    apiSecret: !!apiSecret
  });
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

export async function POST(request: NextRequest) {
  try {
    console.log('Début de la requête d\'upload d\'image');
    console.log('Configuration Cloudinary:', {
      cloud_name: cloudName,
      api_key: apiKey?.substring(0, 5) + '...',
      api_secret: apiSecret ? 'défini' : 'non défini'
    });
    
    // Vérification des credentials avant de continuer
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: 'Configuration Cloudinary incomplète. Vérifiez les variables d\'environnement.' },
        { status: 500 }
      );
    }
    
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
    
    console.log('Image convertie en base64, taille:', base64.length, 'caractères');
    
    try {
      // Télécharger l'image vers Cloudinary
      console.log('Tentative d\'upload vers Cloudinary...');
      const uploadResult = await cloudinary.uploader.upload(base64, {
        folder: 'patisserie',
        resource_type: 'image',
        public_id: `product_${Date.now()}`,
      });
      
      console.log('Image téléchargée avec succès. URL:', uploadResult.secure_url);
      
      return NextResponse.json({ imageUrl: uploadResult.secure_url });
    } catch (cloudinaryError) {
      console.error('Erreur Cloudinary spécifique:', cloudinaryError);
      
      // Extraire des informations plus détaillées de l'erreur Cloudinary
      const errorDetails = cloudinaryError instanceof Error 
        ? cloudinaryError.message
        : JSON.stringify(cloudinaryError);
        
      return NextResponse.json(
        { error: `Erreur Cloudinary: ${errorDetails}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur générale lors du téléchargement de l\'image:', error);
    
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