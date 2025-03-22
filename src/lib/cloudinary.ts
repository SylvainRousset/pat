import { v2 as cloudinary } from 'cloudinary';

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Fonction pour convertir un fichier en base64
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// Upload d'une image à Cloudinary
export async function uploadImage(file: File): Promise<string> {
  try {
    console.log('Début de l\'upload d\'image à Cloudinary');
    console.log('Configuration Cloudinary:', {
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY?.substring(0, 5) + '...',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'défini' : 'non défini'
    });
    
    console.log('Fichier à uploader:', {
      name: file.name,
      type: file.type,
      size: file.size
    });
    
    const base64Data = await fileToBase64(file);
    console.log('Image convertie en base64');
    
    // Suppression du préfixe data:image/...;base64,
    const base64String = base64Data.split(',')[1];
    
    // Upload à Cloudinary
    console.log('Tentative d\'upload vers Cloudinary...');
    const result = await cloudinary.uploader.upload(`data:${file.type};base64,${base64String}`, {
      folder: 'patisserie',
      resource_type: 'auto', // Permet de détecter automatiquement le type de ressource
      public_id: `product_${Date.now()}_${file.name.split('.')[0]}`,
    });
    
    console.log('Upload Cloudinary réussi:', result.secure_url);
    return result.secure_url;
  } catch (error: unknown) {
    console.error('Erreur détaillée lors de l\'upload à Cloudinary:', error);
    
    // Extraire plus d'informations de l'erreur
    if (error instanceof Error) {
      console.error('Message d\'erreur:', error.message);
      console.error('Stack trace:', error.stack);
    } else {
      console.error('Erreur non standard:', JSON.stringify(error));
    }
    
    throw new Error(`Échec de l'upload d'image: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

// Suppression d'une image de Cloudinary
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // Extraire le public_id à partir de l'URL
    const urlParts = imageUrl.split('/');
    const filenameWithExtension = urlParts[urlParts.length - 1];
    const filename = filenameWithExtension.split('.')[0];
    
    // Construire le public_id complet (avec le dossier)
    const folderName = 'patisserie';
    const publicId = `${folderName}/${filename}`;
    
    console.log('Suppression de l\'image avec public_id:', publicId);
    
    // Supprimer l'image
    const result = await cloudinary.uploader.destroy(publicId);
    
    console.log('Résultat de la suppression:', result);
    
    return result.result === 'ok';
  } catch (error: unknown) {
    console.error('Erreur lors de la suppression de l\'image de Cloudinary:', error);
    return false;
  }
}

export default cloudinary; 